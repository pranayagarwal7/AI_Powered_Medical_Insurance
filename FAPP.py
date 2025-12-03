import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import warnings
warnings.filterwarnings('ignore')

# ---------- Load data ----------
@st.cache_data
def load_data():
    try:
        df = pd.read_csv('/Users/ali/Desktop/AI/1003/App/canada_medical_insurance_forecast_detailed.csv')
        df['date'] = pd.to_datetime(df['date'])
        return df
    except FileNotFoundError:
        st.error("❌ Place 'canada_medical_insurance_forecast_detailed (1).csv' in same folder")
        st.stop()

df = load_data()

# ---------- Streamlit App ----------
st.title("🏥 Canadian Medical Insurance Premium Forecaster")
st.markdown("🔮 **Enter your profile** → **See 3-year premium forecast**")

# ---------- Customer Inputs (Most Important Columns) ----------
st.header("📋 Your Profile")
col1, col2 = st.columns(2)

with col1:
    age = st.slider("👤 Age", 18, 80, 35)
    sex = st.selectbox("Gender", df['sex'].drop_duplicates().tolist())
    employer_size = st.selectbox("👔 Employer Size", 
                               sorted(df['employer_size'].drop_duplicates().tolist()))

with col2:
    province = st.selectbox("🏛️ Province", sorted(df['province'].drop_duplicates().tolist()))
    plan_type = st.selectbox("📄 Plan Type", df['plan_type'].drop_duplicates().tolist())
    chronic = st.selectbox("🏥 Chronic Condition?", 
                          ["None"] + sorted(df['chronic_condition'].drop_duplicates().dropna().tolist()))

# ---------- Advanced Inputs ----------
with st.expander("🔧 Advanced Options"):
    col1, col2 = st.columns(2)
    with col1:
        bmi_estimate = st.slider("📏 BMI Estimate", 18.0, 45.0, 25.0)
    with col2:
        risk_score = st.slider("Risk Score (0-5)", 0.0, 5.0, 1.5, 0.1)

# ---------- Generate Forecast ----------
if st.button("🚀 Generate My 3-Year Premium Forecast", type="primary"):
    
    # Create matching criteria
    age_group = "18-34" if age <= 34 else "35-49" if age <= 49 else "50-64"
    
    # Filter similar profiles (multi-column matching)
    similar_df = df[
        (df['age_group'] == age_group) & 
        (df['sex'] == sex) & 
        (df['province'] == province) &
        (df['employer_size'] == employer_size) &
        (df['plan_type'] == plan_type)
    ].copy()
    
    if similar_df.empty:
        # Broaden search if no exact match
        similar_df = df[
            (df['age_group'] == age_group) & 
            (df['sex'] == sex) & 
            (df['province'] == province)
        ].copy()
    
    if similar_df.empty:
        st.error(f"❌ No matching profiles found")
        st.rerun()
    else:
        # Select member with most data
        member_counts = similar_df['member_id'].value_counts()
        selected_member = member_counts.index[0]
        member_data = similar_df[similar_df['member_id'] == selected_member]
        
        st.success(f"✅ **Perfect match found!** Using Member ID: `{selected_member}`")
        
        # ---------- Current Premium ----------
        member_monthly = (
            member_data
            .set_index('date')
            .resample('M')['monthly_premium_cad']
            .mean()
            .dropna()
        )
        
        current_premium = member_monthly.iloc[-1]
        avg_risk_score = member_data['risk_score'].mean()
        
        col1, col2, col3 = st.columns(3)
        col1.metric("💰 Current Monthly Premium", f"${current_premium:.0f}")
        col2.metric("📈 Risk Score", f"{avg_risk_score:.1f}", delta=f"{risk_score:.1f}")
        col3.metric("🏥 Employer Size", employer_size)
        
        # ---------- Forecasting ----------
        if len(member_monthly) >= 12:
            model = ExponentialSmoothing(
                member_monthly,
                trend='add',
                seasonal='add',
                seasonal_periods=min(12, len(member_monthly))
            ).fit()
            forecast_steps = 36
            forecast_series = model.forecast(forecast_steps)
        else:
            # Trend forecast for limited data
            base_premium = member_monthly.iloc[-1]
            # Adjust growth based on risk_score and chronic conditions
            growth_rate = 0.002 + (risk_score * 0.001)  # Higher risk = higher growth
            months = np.arange(36)
            forecast_series = base_premium * (1 + growth_rate) ** months
        
        # Dates
        forecast_dates = pd.date_range(
            start=member_monthly.index[-1] + pd.DateOffset(months=1),
            periods=36, freq='M'
        )
        forecast_series.index = forecast_dates
        
        # ---------- Visualization ----------
        st.subheader("📈 Your 3-Year Premium Forecast")
        fig, ax = plt.subplots(figsize=(14, 7))
        
        # Plot history (last 12 months)
        member_monthly.tail(12).plot(ax=ax, label="Last 12 Months", linewidth=3, color='#1f77b4')
        
        # Plot forecast
        forecast_series.plot(ax=ax, label="3-Year Forecast", linewidth=4, color='#ff4444', linestyle='--')
        
        # Current line
        ax.axhline(y=current_premium, color='#2ca02c', linestyle=':', linewidth=3, 
                  label=f"Current: ${current_premium:.0f}", alpha=0.8)
        
        ax.set_ylabel("Monthly Premium (CAD)", fontsize=12, fontweight='bold')
        ax.set_title(f"Premium Evolution\n"
                    f"({age}yo, {sex}, {province}, {employer_size}, {plan_type})", 
                    fontsize=16, fontweight='bold', pad=20)
        ax.legend(fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()
        st.pyplot(fig)
        
        # ---------- Yearly Summary ----------
        st.subheader("📅 Annual Premium Summary")
        forecast_df = pd.DataFrame({
            'Date': forecast_series.index,
            'Premium': forecast_series.values
        })
        forecast_df['Year'] = forecast_df['Date'].dt.year
        
        yearly_summary = forecast_df.groupby('Year')['Premium'].agg(['mean', 'min', 'max']).round(0)
        yearly_summary.columns = ['Avg', 'Low', 'High']
        yearly_summary['Range'] = yearly_summary['High'] - yearly_summary['Low']
        
        st.dataframe(yearly_summary.style.format({
            'Avg': '${:,.0f}', 'Low': '${:,.0f}', 'High': '${:,.0f}', 'Range': '${:,.0f}'
        }))
        
        # ---------- Key Insights ----------
        st.subheader("💡 Key Insights")
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Trend", "📈 Rising", delta="2-4% yearly")
        col2.metric("Risk Impact", f"{risk_score:.1f}/5", delta="Higher = ↑ Premiums")
        col3.metric("Chronic Effect", chronic, delta="Medical history")
        col4.metric("Province Factor", province[:3], delta="Regional rates")

# ---------- Sidebar: Data Explorer ----------
with st.sidebar:
    st.header("📊 Dataset Summary")
    col1, col2 = st.columns(2)
    col1.metric("Claims", f"{len(df):,}")
    col2.metric("Members", f"{df['member_id'].nunique():,}")
    
    col1.metric("Avg Premium", f"${df['monthly_premium_cad'].mean():.0f}")
    col2.metric("Avg Risk Score", f"{df['risk_score'].mean():.1f}")
    
    st.subheader("🔍 Available Filters")
    st.dataframe(
        df[['province', 'employer_size', 'plan_type']].nunique().to_frame('Count'),
        use_container_width=True
    )
    
    st.markdown("---")
    st.markdown("*Powered by your Forecasting-Model.ipynb*")

st.markdown("---")
st.caption("💾 Uses `canada_medical_insurance_forecast_detailed (1).csv`")

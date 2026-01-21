# 🌾 Smart Crop Recommendation System

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Scikit-Learn](https://img.shields.io/badge/Library-Scikit--Learn-orange)
![Accuracy](https://img.shields.io/badge/Accuracy-99.2%25-brightgreen)
![Maintenance](https://img.shields.io/badge/Maintained%3F-Yes-yellow)

## 📌 Project Overview
Agriculture is the backbone of the economy, but traditional farming often relies on guesswork. This **AI-based Crop Recommendation System** acts as a digital guide for farmers. 

By analyzing specific parameters—such as soil nutrients (N, P, K), pH levels, and local climate data—the system predicts the most suitable crop to plant. This data-driven approach aims to maximize yield, reduce resource wastage, and increase profitability for farmers.



## 🔍 How It Works
The system uses Machine Learning algorithms to classify the suitability of 22 different crops based on 7 key environmental features.

### The Input Features
1.  **Nitrogen (N):** Ratio of Nitrogen content in the soil.
2.  **Phosphorus (P):** Ratio of Phosphorus content in the soil.
3.  **Potassium (K):** Ratio of Potassium content in the soil.
4.  **Temperature:** Average temperature in degrees Celsius.
5.  **Humidity:** Relative humidity in %.
6.  **pH Value:** pH value of the soil (acidic/basic).
7.  **Rainfall:** Average rainfall in mm.

### The Output
The model predicts the optimal crop from a list including:
* *Grains:* Rice, Maize
* *Fruits:* Banana, Apple, Grapes, Mango, Muskmelon, Orange, Papaya, Pomegranate, Watermelon
* *Legumes:* Chickpea, Kidney Beans, Lentil, Moth Beans, Mung Bean, Blackgram, Pigeon Peas
* *Others:* Coconut, Coffee, Cotton, Jute



## ⚙️ Algorithms & Models
We experimented with several classification algorithms to find the best fit:
* **Decision Trees:** For clear interpretability of rules.
* **Naive Bayes:** Good baseline for probabilistic classification.
* **Random Forest (Best Performer):** Used in the final application for its high accuracy and resistance to overfitting.
* **AdaBoost / XGBoost:** Tested for boosting performance.



## 🛠️ Technology Stack
* **Backend:** Python
* **ML Libraries:** Scikit-learn, NumPy, Pandas
* **Visualization:** Matplotlib, Seaborn
* **Web Framework (Optional):** Flask or Streamlit (for the user interface)



## 📊 Dataset
The dataset used for training is available on Kaggle (Crop Recommendation Dataset). It consists of **2200 rows** of data, with 100 entries for each of the 22 crops, ensuring a balanced dataset.



## 🚀 How to Run Locally

### 1. Clone the Repo
```bash
git clone https://github.com/ruchitdonga/Al-Based-Crop-Recommendation-for-Farmers.git
cd Al-Based-Crop-Recommendation-for-Farmers
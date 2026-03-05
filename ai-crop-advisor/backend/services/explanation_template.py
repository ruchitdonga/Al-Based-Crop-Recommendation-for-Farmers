class ExplanationTemplate:

    LANGUAGE_TEXT = {
        "en": {
            "soil": "Soil pH {ph} is suitable for {crop}.",
            "ml": "Based on similar soil conditions in historical data, {crop} is recommended."
        },
        "mr": {
            "soil": "जमिनीचा पीएच {ph} {crop} साठी योग्य आहे.",
            "ml": "ऐतिहासिक डेटावर आधारित, {crop} शिफारस केली जाते."
        },
        "hi": {
            "soil": "मिट्टी का pH {ph} {crop} के लिए उपयुक्त है।",
            "ml": "ऐतिहासिक डेटा के आधार पर {crop} की सिफारिश की जाती है।"
        },
        "gu": {
            "soil": "જમીનનો pH {ph} {crop} માટે યોગ્ય છે.",
            "ml": "ઇતિહાસિક ડેટાના આધાર પર {crop} ભલામણ કરવામાં આવે છે."
        }
    }

    def build(self, crop, soil_ph, lang="en"):

        text = self.LANGUAGE_TEXT.get(lang, self.LANGUAGE_TEXT["en"])

        sentence1 = text["soil"].format(
            ph=soil_ph,
            crop=crop
        )

        sentence2 = text["ml"].format(
            crop=crop
        )

        return f"1. {sentence1} 2. {sentence2}"
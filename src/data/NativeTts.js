import { toast } from "vue-sonner";
import { getBoolean, getString } from "./Database";



export function stopSpeaking() {
    AndroidTTS.stop()
}

export function isSpeaking() {
    return AndroidTTS.isSpeaking()
}


export function isAccentAvailable(accent = 'US') {
    return AndroidTTS.isAccentAvailable(accent)
}

export function setAccent(accent = 'US') {
    AndroidTTS.setAccent(accent);
}

export function setVoice(name) {
    AndroidTTS.setVoice(name)
}

export function installVoiceData() {
    return AndroidTTS.installVoiceData()
}

export function setSpeechRate(rate = 0.9) {
    AndroidTTS.setSpeechRate(rate);
}

export function isEnglishVoiceAvailable() {
    return AndroidTTS.isEnglishVoiceAvailable()
}

export function isTtsSupported() {
    return AndroidTTS.isTtsSupported()
}

export function textToSpeech(word, callback_id = '', force = true) {
    const active = getBoolean('setting_tts_enabled', true);

    if (AndroidTools?.getVolumePercent && AndroidTools.getVolumePercent() < 20) {
        toast('صدای گوشی بسیار کم است ممکن است تلفظ صوتی شنیده نشود')
    }

    if (active || force) {
        AndroidTTS.speak(word, callback_id);
    }

}

export function getAvailableVoices() {
    return JSON.parse(AndroidTTS.getAvailableVoices());
}


/**
 * تنظیمات ذخیره شده صدا را از دیتابیس خوانده و روی موتور TTS اعمال می‌کند
 */
export const initVoiceData = async () => {
    try {
        console.log("Initializing Voice Settings...");

        // 1. دریافت و تنظیم سرعت صدا (Speech Rate)
        // مقدار پیش‌فرض در SettingsAudio.vue برابر 0.9 بود
        const savedRate = await getString('setting_tts_rate', '0.9');
        const rate = parseFloat(savedRate);
        if (!isNaN(rate)) {
            setSpeechRate(rate);
            console.log(`Speech Rate set to: ${rate}`);
        }

        // 2. دریافت و تنظیم لهجه (Accent)
        // مقدار پیش‌فرض US
        const savedAccent = await getString('setting_tts_accent', 'US');
        if (savedAccent) {
            setAccent(savedAccent);
            console.log(`Accent set to: ${savedAccent}`);
        }

        // 3. دریافت و تنظیم صدای خاص (Selected Voice)
        // اگر کاربر قبلاً صدای خاصی را انتخاب کرده باشد
        const savedVoice = await getString('setting_tts_voice', '');
        if (savedVoice && savedVoice !== '') {
            const list = await getAvailableVoices();
            let findVoice = false;
            for (const voice of list) {
                if(voice.name == savedVoice){
                    console.log(`Find and Voice set to: ${savedVoice}`);
                    setVoice(savedVoice);
                    findVoice = true;
                    break;
                }
            }

            if(findVoice == false){
                console.log('Voice Not Found');
                
            }
            
        }

    } catch (error) {
        console.error("Error initializing voice data:", error);
    }
};
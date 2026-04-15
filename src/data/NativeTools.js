import { getBoolean } from "./Database";



export function vibrate(duration = 50){
    const active = getBoolean('setting_vibration', true);

    if(active){
        AndroidTools.vibrate(duration);
    }
}
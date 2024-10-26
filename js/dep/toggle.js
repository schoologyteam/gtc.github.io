/// 
export class toggle {
    get active() {
        return this._active;
    }
    constructor() {
        this._active = false;
    }
    on() {
        if (this.active)
            return true; // It was already on
        this._active = true;
        return false; // It was not on
    }
    off() {
        if (!this.active)
            return true;
        this._active = false;
        return false;
    }
}
export default toggle;

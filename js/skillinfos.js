class SkillInfo {
    constructor(__id, skillName, infos) {
        this._rowspan = 1;
        this._defaultLevel = 0;
        this._id = __id;
        this._availablelevel = window.c_maxlevel + 1;
        this._currentskilllevel = 0;
        this._name = skillName;
        this._passive = false;
        this._parent = null;
        this._visible = true;
        this._spused = 0;
        this.Assignable = true;
        this.readInfos(infos);
    }

    SetParent(obj) {
        this._parent = obj;
    }

    get Parent() { return this._parent; }
    get ID() { return this._id; }
    get Name() { return this._name; }
    get AvailableLevel() { return this._availablelevel; }
    GetAvailableLevel() { return this._availablelevel; }
    GetSPUsed() { return this._spused; }
    get CurrentSkillLevel() { return this._currentskilllevel; }
    get MaxLevel() { return this._skillmaxlevel; }
    CurrentLevelInfo() { return this.Levels[this._currentskilllevel]; }
    get IconURL() { return this._iconURL; }
    get IsPassive() { return this._passive; }
    get GetDefaultLevel() { return this._defaultLevel; }
    get IsAssignable() { return this.Assignable; }
    GetRowSpan() { return this._rowspan; }
    NextLevelInfo() {
        return this.Levels[this._currentskilllevel + 1];
    }
    PreviousLevelInfo() {
        return this.Levels[this._currentskilllevel - 1];
    }
    get Extensions() {
        if (!this._extensions) {
            this._extensions = {};
            var extName, exteItem;
            for (var extIndex in this._string_extensions) {
                extName = this._string_extensions[extIndex];
                exteItem = window.SkillCore.GetSkill(extName);
                exteItem.SetParent(this);
                this._extensions[extName] = exteItem;
            }
        }
        return this._extensions;
    }
    get Visible() { return this._visible; }

    UnlearnSkill() {
        if (this._availablelevel > window.SkillCore.GetCurrentLevel())
            this.SetCurrentSkillLevel(0);
        else
            this.ToDefaultLevel();
    }

    ToDefaultLevel() {
        this.SetCurrentSkillLevel(Math.max(0, this._defaultLevel));
    }

    readInfos(ob) {
        this.Levels = [];
        var lastDescription = "";
        for (var skinfo in ob.Levels) {
            if (ob.Levels[skinfo].Description)
                lastDescription = ob.Levels[skinfo].Description;
            this.Levels.push(new LevelInfo(ob.Levels[skinfo].RequiredLevel,
                ob.Levels[skinfo].RequiredSP, ob.Levels[skinfo].Effect, lastDescription));
        };
        this._string_extensions = ob.Extensions;
        if (ob.Passive)
            this._passive = ob.Passive;
        this._iconURL = ob.Icon;
        if (ob.Assignable == false)
            this.Assignable = ob.Assignable;
        if (ob.Visible == false)
            this._visible = ob.Visible;
        this._skillmaxlevel = this.Levels.length - 1;
        if (ob.DefaultLevel > 0)
            this._defaultLevel = ob.DefaultLevel;
        this._availablelevel = this.Levels[1].RequiredLevel;
        if (ob.ID)
            this.ShortID = ob.ID;
        if (ob.RowSpan > 0)
            this._rowspan = ob.RowSpan;
        this.SetCurrentSkillLevel(this._defaultLevel);
        if (this._availablelevel <= window.SkillCore.GetCurrentLevel()) {
            var paraminfo = GetUrlParam(this._id, null);
            if (!paraminfo && this.ShortID)
                paraminfo = GetUrlParam(this.ShortID, null);
            if (!paraminfo) paraminfo = this._defaultLevel;
            this.SetCurrentSkillLevel(paraminfo);
        } else
            this.SetCurrentSkillLevel(0);
    }

    SetCurrentSkillLevel(_level) {
        for (var count = 0; count <= this._skillmaxlevel; count++) {
            if (this._currentskilllevel > _level)
                this.SkillDownEx();
            if (this._currentskilllevel < _level)
                this.SkillUp();
            if (this._currentskilllevel == _level)
                break;
        }
    }
}

class LevelInfo {
    constructor(__requiredlevel, __requiredsp, __effect, __description) {
        this._requiredlevel = __requiredlevel;
        this._requiredsp = __requiredsp;
        this._description = __description;
        this._effect = __effect;
    }

    get RequiredSP() { return this._requiredsp; }
    get RequiredLevel() { return this._requiredlevel; }
    get SkillDescription() { return this._description; }
    get SkillEffect() { return this._effect; }
}
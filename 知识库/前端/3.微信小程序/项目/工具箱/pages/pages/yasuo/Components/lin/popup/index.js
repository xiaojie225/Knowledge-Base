Component({
    externalClasses: [ "popup-class" ],
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        zIndex: {
            type: Number,
            value: 99
        },
        animation: {
            type: String,
            value: "show"
        },
        contentAlign: {
            type: String,
            value: ""
        },
        locked: {
            type: Boolean,
            value: false
        }
    },
    data: {},
    methods: {
        doNothingMove: function(t) {},
        doNothingTap: function() {},
        onPupopTap: function(t) {
            true !== this.data.locked && this.setData({
                show: !this.data.show
            }), this.triggerEvent("lintap", true, {});
        }
    }
});
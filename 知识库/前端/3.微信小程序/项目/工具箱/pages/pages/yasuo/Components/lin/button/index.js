Component({
    externalClasses: [ "l-class", "l-hover-class", "l-img-class" ],
    properties: {
        name: {
            type: String,
            value: "lin"
        },
        type: {
            type: String,
            value: "default"
        },
        plain: Boolean,
        size: {
            type: String,
            value: "medium"
        },
        shape: {
            type: String,
            value: "circle"
        },
        disabled: {
            type: Boolean,
            value: false
        },
        special: {
            type: Boolean,
            value: false
        },
        loading: {
            type: Boolean,
            value: false
        },
        width: Number,
        height: Number,
        icon: String,
        image: String,
        iconStyle: {
            type: String,
            value: "size:20;color:#ff4444"
        },
        iconColor: String,
        iconSize: String,
        openType: String,
        appParameter: String,
        lang: String,
        hoverStopPropagation: Boolean,
        hoverStartTime: {
            type: Number,
            value: 20
        },
        hoverStayTime: {
            type: Number,
            value: 70
        },
        sessionFrom: {
            type: String,
            value: ""
        },
        sendMessageTitle: String,
        sendMessagePath: String,
        sendMessageImg: String,
        showMessageCard: Boolean,
        formType: String
    },
    methods: {
        handleTap: function() {
            if (this.data.disabled) return false;
            this.triggerEvent("lintap"), this.triggerEvent("lintapcatch", {}, {
                bubbles: true
            });
        },
        openTypeEvent: function(e) {
            this.triggerEvent(e.type, e.detail, {});
        }
    }
});
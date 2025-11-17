Component({
    externalClasses: [ "l-container-class", "l-class" ],
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        type: {
            type: String,
            value: "rotate"
        },
        color: {
            type: String,
            value: ""
        },
        size: {
            type: String,
            value: "default"
        },
        custom: {
            type: Boolean,
            value: false
        },
        fullScreen: {
            type: Boolean,
            value: false
        }
    },
    methods: {
        doNothingMove: function(e) {}
    }
});
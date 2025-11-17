Page({
    data: {
        width: 0,
        height: 0
    },
    onLoad: function() {
        var t = this;
        wx.getSystemInfo({
            success: function(e) {
                t.width = e.windowWidth, t.height = e.windowHeight;
            }
        });
    },
    onReady: function() {
        this.canvasClock(), this.interval = setInterval(this.canvasClock, 1e3);
    },
    canvasClock: function() {
        var t = wx.createContext(), e = this.width, a = this.height, i = e / 2 - 55;
        t.height = t.height, t.translate(e / 2, a / 2), t.save(), t.setLineWidth(2), t.beginPath(), 
        t.arc(0, 0, e / 2 - 30, 0, 2 * Math.PI, !0), t.closePath(), t.stroke(), t.beginPath(), 
        t.arc(0, 0, 8, 0, 2 * Math.PI, !0), t.closePath(), t.stroke(), function() {
            t.setFontSize(20), t.textBaseline = "middle";
            for (var e = 1; e < 13; e++) {
                var a = i * Math.cos(e * Math.PI / 6 - Math.PI / 2), n = i * Math.sin(e * Math.PI / 6 - Math.PI / 2);
                11 == e || 12 == e ? t.fillText(e, a - 12, n + 9) : t.fillText(e, a - 6, n + 9);
            }
        }(), function() {
            t.setLineWidth(1), t.rotate(-Math.PI / 2);
            for (var a = 0; a < 60; a++) t.beginPath(), t.rotate(Math.PI / 30), t.moveTo(e / 2 - 30, 0), 
            t.lineTo(e / 2 - 40, 0), t.stroke();
        }(), function() {
            t.setLineWidth(5);
            for (var a = 0; a < 12; a++) t.beginPath(), t.rotate(Math.PI / 6), t.moveTo(e / 2 - 30, 0), 
            t.lineTo(e / 2 - 45, 0), t.stroke();
        }(), function() {
            var a = new Date(), i = a.getHours();
            i = i > 12 ? i - 12 : i;
            var n = a.getMinutes(), o = a.getSeconds();
            t.save(), t.setLineWidth(7), t.beginPath(), t.rotate(Math.PI / 6 * (i + n / 60 + o / 3600)), 
            t.moveTo(-20, 0), t.lineTo(e / 4.5 - 20, 0), t.stroke(), t.restore(), t.save(), 
            t.setLineWidth(5), t.beginPath(), t.rotate(Math.PI / 30 * (n + o / 60)), t.moveTo(-20, 0), 
            t.lineTo(e / 3.5 - 20, 0), t.stroke(), t.restore(), t.save(), t.setLineWidth(2), 
            t.beginPath(), t.rotate(Math.PI / 30 * o), t.moveTo(-20, 0), t.lineTo(e / 3 - 20, 0), 
            t.stroke();
        }(), wx.drawCanvas({
            canvasId: "myCanvas",
            actions: t.getActions()
        });
    },
    onUnload: function() {
        clearInterval(this.interval);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    window.calculateRepayment = function(e, t) {
        apr = 12;
        pubapr = "12";
        wI = apr / 52 / 100;
        fI = apr / 26 / 100;
        foI = apr / 13 / 100;
        mI = apr / 12 / 100;
        years = t;
        bit2 = Math.pow(1 + mI, 12 * (years / 12));
        result = mI * 100 * e * bit2 / (100 * (bit2 - 1));
        intr = result * 12 * (years / 12) - e;
        result = Math.round(result * 100) / 100;
        meanRepayment = result;
        intr = Math.round(intr * 100) / 100;
        totalInterest = intr;
        totalRepaid = (Math.round(e * 100) + Math.round(totalInterest * 100)) / 100
    }

    window.displayRepayment = function() {
        if (document.loanDetails.sumLent.value === "" || document.loanDetails.expectedRepaymentTerm.value === "") {
            return
        }
        var e = document.loanDetails.sumLent.value;
        if (isNaN(e)) {
            e = 0
        }
        e = fix2dp(e);
        document.loanDetails.sumLent.value = e;
        var t = document.loanDetails.expectedRepaymentTerm.value;
        if (!isNaN(t)) {
            t = round(t);
            if (rPeriodT == 30) {
                if (t < 1) {
                    t = 1
                } else if (t > 36) {
                    t = 36
                }
            } else {
                if (t < 4) {
                    t = 4
                } else if (t > 104) {
                    t = 104
                }
            }
        } else {
            if (rPeriodT == 30) {
                t = 12
            } else {
                t = 52
            }
        }
        document.loanDetails.expectedRepaymentTerm.value = t;
        calculateRepayment(e, t);
        document.loanDetails.meanRepayment.value = meanRepayment;
        document.loanDetails.rPeriodDisp.value = rPeriodDisp;
        document.loanDetails.totalRepaid.value = totalRepaid;
        document.loanDetails.totalInterest.value = totalInterest
    }

    function calculateMaxLoan() {
        var e = document.loanDetails.expectedRepaymentTerm.value;
        var t = document.loanDetails.meanRepayment.value;
        if (isNaN(t)) {
            t = 0
        }
        t = fix2dp(t);
        document.loanDetails.meanRepayment.value = t;
        var n = e * t;
        var r = n / 16;
        while (r > .2) {
            calculateRepayment(n, e);
            if (meanRepayment > t) {
                n -= r
            } else {
                n += r
            }
            r /= 2;
            document.loanDetails.sumLent.value = fix2dp(n)
        }
        n = Math.round(n - .5);
        document.loanDetails.sumLent.value = fix2dp(n);
        calculateRepayment(n, e);
        document.loanDetails.meanRepayment.value = meanRepayment;
        document.loanDetails.rPeriodDisp.value = rPeriodDisp;
        document.loanDetails.totalRepaid.value = totalRepaid;
        document.loanDetails.totalInterest.value = totalInterest
    }

    function changePeriod(e) {
        rPeriodT = e;
        if (e == 30) {
            rPeriodDisp = " month"
        } else {
            rPeriodDisp = " week"
        }
        displayRepayment()
    }

    function round(e) {
        return Math.round(e * 100) / 100
    }

    function floor(e) {
        return Math.round(e * 100 - .5) / 100
    }

    function ceil(e) {
        return Math.round(e * 100 + .5) / 100
    }

    function fix2dp(e) {
        var t = "" + Math.round(e * 100);
        var n = t.length - 2;
        outStr = t.substring(0, n) + "." + t.substring(n, t.length);
        return outStr
    }
    var K = Math.exp(12 * Math.log(1.01) / 360) - 1;
    var rPeriodDisp = " month";
    var sumLent, meanRepayment, totalRepaid, totalInterest;
    var rPeriodT = 30
});

import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, Validator, NG_VALIDATORS } from '@angular/forms';

declare var $: any;

@Component({
    selector: 'main-container.content, page-content',
    templateUrl: './loan-calculator.component.html'
})
export class LoanCalculatorComponent {
    loanDetails: FormGroup;

    K: number = Math.exp(12 * Math.log(1.01) / 360) - 1;
    rPeriodDisp: string = " month";
    sumLent: number;
    meanRepayment: number;
    totalRepaid: number;
    totalInterest: number;
    rPeriodT: number = 30;

    constructor(fb: FormBuilder) {
        this.loanDetails = fb.group({
            expectedRepaymentTerm: '',
            sumLent: '',
            meanRepayment: '',
            rPeriodDisp: '',
            totalRepaid: '',
            totalInterest: ''
        });
    }

    calculateRepayment(e, t) {
        let apr = 12;
        let pubapr = "12";
        let wI = apr / 52 / 100;
        let fI = apr / 26 / 100;
        let foI = apr / 13 / 100;
        let mI = apr / 12 / 100;
        let years = t;
        let bit2 = Math.pow(1 + mI, 12 * (years / 12));
        let result = mI * 100 * e * bit2 / (100 * (bit2 - 1));
        let intr = result * 12 * (years / 12) - e;
        result = Math.round(result * 100) / 100;
        this.meanRepayment = result;
        intr = Math.round(intr * 100) / 100;
        this.totalInterest = intr;
        this.totalRepaid = (Math.round(e * 100) + Math.round(this.totalInterest * 100)) / 100;
    }

    displayRepayment() {
        if(this.loanDetails.controls['sumLent'].value === "" || this.loanDetails.controls['expectedRepaymentTerm'].value === "") {
            return;
        }
        var e = this.loanDetails.controls['sumLent'].value;
        if(isNaN(e)) {
            e = 0;
        }
        e = this.fix2dp(e);
        this.loanDetails.patchValue({
            sumLent: e
        });
        var t = this.loanDetails.controls['expectedRepaymentTerm'].value;
        if(!isNaN(t)) {
            t = this.round(t);
            if(this.rPeriodT == 30) {
                if(t<1) {
                    t = 1;
                } else if(t > 36) {
                    t = 36;
                }
            } else {
                if (t < 4) {
                    t = 4;
                } else if(t > 104) {
                    t = 104;
                }
            }
        } else {
            if(this.rPeriodT == 30) {
                t = 12;
            } else {
                t = 52;
            }
        }
        this.loanDetails.patchValue({
            expectedRepaymentTerm: t
        });
        this.calculateRepayment(e,t);
        this.loanDetails.patchValue({
            meanRepayment: this.meanRepayment,
            rPeriodDisp: this.rPeriodDisp,
            totalRepaid: this.totalRepaid,
            totalInterest: this.totalInterest
        });
    }

    calculateMaxLoan() {
        var e = this.loanDetails.controls['expectedRepaymentTerm'].value;
        var t = this.loanDetails.controls['meanRepayment'].value;
        if(isNaN(t)) {
            t = 0
        }
        t = this.fix2dp(t);
        this.loanDetails.patchValue({
            meanRepayment: t
        });
        var n = e * t;
        var r = n / 16;
        while(r > 0.2) {
            this.calculateRepayment(n, e);
            if(this.meanRepayment > t) {
                n -= r;
            } else {
                n += r;
            }
            r /= 2;
            this.loanDetails.patchValue({
                sumLent: this.fix2dp(n)
            });
        }
        n = Math.round(n - 0.5);
        this.loanDetails.patchValue({
            sumLent: this.fix2dp(n)
        });
        this.calculateRepayment(n,e);
        this.loanDetails.patchValue({
            meanRepayment: this.meanRepayment,
            rPeriodDisp: this.rPeriodDisp,
            totalRepaid: this.totalRepaid,
            totalInterest: this.totalInterest
        });
    }

    changePeriod(e) {
        this.rPeriodT = e;
        if(e == 30) {
            this.rPeriodDisp = " month";
        } else {
            this.rPeriodDisp = " week";
        }
        this.displayRepayment();
    }

    round(e) {
        return Math.round(e * 100) / 100
    }

    floor(e) {
        return Math.round(e * 100 - 0.5) / 100
    }

    ceil(e) {
        return Math.round(e * 100 + 0.5) / 100
    }

    fix2dp(e) {
        var t = "" + Math.round(e * 100);
        var n = t.length - 2;
        return t.substring(0,n) + "." + t.substring(n,t.length);
    }
}

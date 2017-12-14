import { Component, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'script-hack',
    templateUrl: './script-hack.component.html'
})
export class ScriptHackComponent {
    @Input() src: string;
    @Input() type: string;
    @Input() id: string;
    @ViewChild('script') script: ElementRef;

    convertToScript() {
        var element = this.script.nativeElement;
        var script = document.createElement("script");
        script.type = this.type ? this.type : "text/javascript";
        if (this.src) {
            script.src = this.src;
        }
        if(this.id) {
            script.id = this.id;
        }
        if (element.innerHTML) {
            script.innerHTML = element.innerHTML;
        }
        var parent = element.parentElement;
        parent.parentElement.replaceChild(script, parent);
    }

    ngAfterViewInit() {
        this.convertToScript();
    }
}

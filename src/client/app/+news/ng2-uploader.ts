import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgZone,
  Provider,
  forwardRef
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

declare var $: any;

// Control Value accessor provider
const NG2UPLOADER_CONTROL_VALUE_ACCESSOR = new Provider(
  NG_VALUE_ACCESSOR,
  {
    useExisting: forwardRef(() => Ng2Uploader),
    multi: true
  }
);

@Component({
  selector: 'ng2-uploader',
  providers: [NG2UPLOADER_CONTROL_VALUE_ACCESSOR],
  styles: [`
    label.uploader input[type="file"] {
        position: fixed;
        top: -1000px;
    }

    .uploader,
    .fileLink {
        font-size: 1rem;
        padding: 0.375rem 0.75rem;
    }
    .uploader {
        display: block;
        border: 1px solid #AAA;
        border-radius: 0.25rem;
        cursor: pointer;
        width: 150px;
        text-align: center;
        color: #55595c;
    }
    .uploader:hover,
    .uploader:active {
        background: #CCC;
    }
    .uploader:invalid + span {
        color: #A44;
    }
    .uploader:valid + span {
        color: #4A4;
    }

    .filesContainer {
        min-height: 45px; /* minimum height of cover stripe */
    }
    .imgContainer {
        min-height: 100px; /* minimum height of cover stripe */
    }
    .fileWrap,
    .fileLinkWrap {
        position: relative;
        overflow: hidden;
    }
    .fileLinkWrap {
        float: left;
        display: block;
    }
    .fileDel {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 200;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 18px;
        font-size: 15px;
        font-weight: bold;
        color: #fff;
        border-radius: 50%;
        background: rgba(62, 42, 22, 0.5);
        cursor: pointer;
    }
    .fileDel:hover {
        background: rgba(62, 42, 22, 0.8);
    }
    .fileLink,
    .sameHeight {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 100;
    }
    .sameHeight {
        width: auto; /* maintain width/height aspect ratio */
        height: 95px;
        margin-bottom: 5px;
    }
    .fileLink {
        height: 40px;
        text-align: left;
        margin: 0 0 5px .375rem;
        overflow: hidden;
    }
  `],
  template: `
    <label class="uploader" [hidden]="hideUploader">
        <input type="file" class="fileUpl" (change)="uploadFile($event)" />
        <span><i class="fa fa-upload" aria-hidden="true"></i> {{ uploadLabel }}</span>
    </label>
    <div class="row" [ngClass]="{'filesContainer': type=='file', 'imgContainer': type=='image'}" *ngIf="showFiles()" [ngSwitch]="type">
        <template ngSwitchCase="file">
            <div *ngFor="let file of files; let i = index" class="col-sm-12 col-md-3 col-lg-3 fileLinkWrap">
                <a href="{{file.fileName}}" target="_blank" class="sameHeight fileLink"><i class="fa fa-file" aria-hidden="true"></i> {{file.name}}</a>
                <span class="fileDel" title="{{delLabel}}" (click)="deleteFile(file)">x</span>
            </div>
        </template>
        
        <template ngSwitchCase="image">
            <div *ngFor="let file of files; let i = index" class="col-sm-12 col-md-2 fileWrap">
                <img src="{{file.thumbName}}" class="img-fluid img-rounded sameHeight" />
                <span class="fileDel" title="{{delLabel}}" (click)="deleteFile(file)">x</span>
            </div>
        </template>
    </div>
  `,
})

export class Ng2Uploader {
    
    /** URL for upload server files */
    @Input() hostUpload: string;

    /** Uploaded files server folder */
    @Input() uploadFolder: string = "";

    /** Label for upload button */
    @Input() uploadLabel: string = "";

    /** Label for delete button */
    @Input() delLabel: string = "";

    /** Upload type file/image */
    @Input() type: string = "";

    /** Set single file upload */
    @Input() single: boolean;

    /** Set required field */
    @Input() required: boolean;

    @Output() change = new EventEmitter<any>();

    public files: Array<any> = [];

    private hideUploader: boolean = false;

    constructor (
        private _zone: NgZone,
        private _http: Http
    ) {}
    
    get value(): any { return this.files; };
    @Input() set value(v) {       
        if (v !== this.files) {
            this.files = v;
            this._onChangeCallback(v);
        }
    }

    /**
     *  Value update process
     * 
     *  @param value
     */
    updateValue (value: any) {
        this._zone.run(() => {
            this.files.indexOf(value) > -1
                ? this.files.splice(this.files.indexOf(value), 1)
                : this.files.push(value);

            this.onChange(this.files);
            this._onTouchedCallback();
            this.change.emit(this.files);
        });
    }

    /**
     *  Check if exists uploaded files for display
     * 
     *  @return boolean
     */
    showFiles() {
        return this.files.length > 0 ? true : false;
    }

    /**
     *  Uploader change event, first check if file is already uploaded then upload
     * 
     *  @param event
     */
    uploadFile(event: any) {
        
        let sourceFile: any = event.target.files[0]
        let goUpload: boolean = true;
        let checkFile: string;

        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].fileName.indexOf(sourceFile.name) > 0) {
                goUpload = false;
            }
        }

        if (goUpload) {
            this._fileUpload(sourceFile);
        }
        else {
            this._errHandle("File is already uploaded.");
        }
    }

    /**
     *  Delete file action
     * 
     *  @param fileUrl
     */
    deleteFile(fileUrl: any) {
        let origFileUrl = fileUrl;
        if (fileUrl.name) {
            fileUrl = fileUrl.fileName;
        }
        if (fileUrl.thumbName) {
            fileUrl = [fileUrl.thumbName, fileUrl.fileName];
        }
        this._fileDelete(fileUrl)
            .then((resp: any) => { 
                let delFile: any = resp.json().data;
                if (delFile[0].deletedFile == fileUrl || (delFile[0].deletedFile == fileUrl[0] && delFile[1].deletedFile == fileUrl[1])) {
                    this.updateValue(origFileUrl);
                    if (typeof this.single !== 'undefined') {
                        this.hideUploader = false;
                    }
                }
             })
            .catch((err: any) => { this._errHandle(err) });
    }

    /**
     *  Upload http request
     * 
     *  @param sourceFile
     */
    private _fileUpload(sourceFile: any) {
        let data = new FormData();
        data.append("file", sourceFile);
        data.append("action", "upload");
        if (this.type == "image") {
            data.append("image", "resize");
        }
        data.append("folder", this.uploadFolder);

        $.post({
            data: data,
            type: "POST",
            url: this.hostUpload,
            cache: false,
            contentType: false,
            processData: false,
            success: (uploadedFile: any) => {
                if (typeof this.single !== 'undefined') {
                    this.hideUploader = true;
                }
                this.updateValue(uploadedFile.data[0]);
            },
            error: (err: any) => { this._errHandle(err) }
        });
    }

    /**
     *  Delete http request
     * 
     *  @param fileUrl
     */
    private _fileDelete(fileUrl: any) {
        let data: any = JSON.stringify({
            action: "del",
            file: fileUrl
        });

        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({headers: headers});
        
        return this._http.post(this.hostUpload, data, options)
                .toPromise()
                .then((response: any) => response)
                .catch((err: any) => Promise.reject(err.message || err));
    }

    /**
     * Hanle error in console
     */
    private _errHandle(err: any) {
      console.error("Error");
      console.log(err);
    }

    /**
     * Implements ControlValueAccessor
     */
    writeValue (value: any) {}
    onChange(event: any) {}
    onTouched () {}
    registerOnChange (fn: any) { this.onChange = fn; }
    registerOnTouched (fn: any) { this.onTouched = fn; }
    _onChangeCallback (_: any) {}
    _onTouchedCallback () {}
}

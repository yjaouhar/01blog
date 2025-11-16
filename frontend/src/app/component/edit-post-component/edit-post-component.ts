import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-post',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post-component.html',
})
export class EditPostComponent {

  @Input() desc: string='lll';
  @Input() currentMedia!: string | null;
  form: FormGroup;
  isImage = false;
  isVideo = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({

      userInput: [this.desc]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const type = file.type;

    const reader = new FileReader();
    reader.onload = () => {
      this.currentMedia = reader.result as string;
      this.isImage = type.startsWith("image");
      this.isVideo = type.startsWith("video");
    };
    reader.readAsDataURL(file);
  }

  deleteMedia() {
    this.currentMedia = null;
    this.isImage = false;
    this.isVideo = false;
  }

  onSubmit() {
    console.log("Description:", this.form.value.userInput);
    console.log("Media:", this.currentMedia);
  }
}

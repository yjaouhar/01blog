import { Component, EventEmitter, inject, Output, output, signal } from '@angular/core';
import { max } from 'rxjs';
import { PostService } from '../../services/post.service';
interface MediaFile {
  url: string;
  type: 'image' | 'video';
}
@Component({
  selector: 'app-post-create-component',
  imports: [],
  templateUrl: './post-create-component.html',
  styleUrl: './post-create-component.css',
})
// max file size in bytes

export class PostCreateComponent {
  readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 50MB
  @Output() hide = new EventEmitter<boolean>()
  postService = inject(PostService);
  content = signal("");
  file = signal<File[]>([])
  mediaFiles = signal<MediaFile[]>([]);
  hasError = signal(false)
  messagError = signal("")
  changeContent(content: Event) {
    const value: string = (content.target as HTMLTextAreaElement).value;
    this.content.update(c => value);
  }

  submit() {

    if (!this.content().trim()) {
      this.hasError.set(true)
      this.messagError.set("content requerd")
    }

    if (this.content().trim().length > 500) {
      this.hasError.set(true)
      this.messagError.set("content must 500 caracter")
    }
    const data = {
      description: this.content().trim()
    }
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
    this.file().forEach(f => formData.append('file', f));
    this.postService.creatPost(formData).subscribe({
      next: res => {
        this.hide.emit(true)
      }
    })

  }

  async addMedia(event: Event) {
    this.hasError.set(false)
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];



    const type = file.type.startsWith('image') ? 'image' : 'video';
    if (type !== "image" && type !== "video") {
      this.hasError.set(true)
      this.messagError.set(`Only image/video allowed`)
      return
    }
    // max size in bytes(5MB for image, 20MB for video)
    const maxSize = type == "image" ? 8 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      this.hasError.set(true);
      this.messagError.set(`File too large. Max allowed: ${maxSize / (1024 * 1024)} MB`)
      return
    }
    let url = '';
    if (type === 'image') {
      const croppedBlob = await this.cropImageToSquare(file, 150);
      url = URL.createObjectURL(croppedBlob);
    } else {
      url = URL.createObjectURL(file);
    }

    this.mediaFiles.update(arr => [...arr, { url, type }]);
    this.file.update(f => [...f, file])
    input.value = '';
  }

  removeMedia(index: number) {
    this.mediaFiles.update(arr => arr.filter((_, i) => i !== index));
    this.file.update(f => f.filter((_, i) => i !== index));
  }

  close() {
    this.hide.emit(true)
  }

  cropImageToSquare(file: File, size = 150): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = e => img.src = e.target!.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No context');

        // crop center
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject('Crop failed');
        }, file.type);
      };

      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

}

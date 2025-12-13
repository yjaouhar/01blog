import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import { Router } from 'express';
declare var bootstrap: any;
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  avatarPreview: any = null;
  constructor(
    private router: Router
  ) { }
  authService = inject(AuthService);
  birthdayError = signal(false);
  hasError = signal(false);
  messagError = signal('')
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
    gender: new FormControl('', [Validators.required, Validators.pattern('male|female')]),
    birthday: new FormControl('', Validators.required),
    bio: new FormControl('', Validators.maxLength(200)),
    username: new FormControl('', [Validators.minLength(4), Validators.maxLength(15)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    avatar: new FormControl<File | null>(null)

  })


  submit() {
    const registerData = this.registerForm;
    if (registerData.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    if (!registerData.value.username?.trim()) {
      registerData.value.username = null;
    }
    const data = {
      firstName: registerData.value.firstName,
      lastName: registerData.value.lastName,
      birthday: registerData.value.birthday,
      gender: registerData.value.gender,
      bio: registerData.value.bio,
      username: registerData.value.username,
      email: registerData.value.email,
      password: registerData.value.password,
    }
    formData.append("data", new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (registerData.value.avatar) {
      formData.append("file", registerData.value.avatar);
    }


    this.authService.register(formData).subscribe(res => {
      if (res.success) {
        this.router.navigate(['/login']);
      } else {
        this.hasError.set(true);
        const message = res.message?.map(m => '*' + m.message).join('\n');
        this.messagError.set(message!)
      }

    })
  }
  changeBirthaday(event: Event) {
    const birthday = event.target as HTMLInputElement
    if (!this.validBirthday(birthday.value)) {
      this.birthdayError.update(() => true);
    } else {
      this.birthdayError.update(() => false);
    }
  }
  validBirthday(input: string): boolean {
    const birthDate = new Date(input);
    const currentDate = new Date()
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      currentDate.getMonth() > birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return age >= 10;
  }
  @ViewChild('cropImage') cropImage!: ElementRef<HTMLImageElement>;
  @ViewChild('viewport') viewport!: ElementRef<HTMLDivElement>;
  scale = 1;
  imgNaturalWidth = 0;
  imgNaturalHeight = 0;
  // position of image top-left relative to viewport (in pixels)
  posX = 0;
  posY = 0;

  dragging = false;
  startX = 0;
  startY = 0;
  startPosX = 0;
  startPosY = 0;

  // modal instance
  modalInstance: any = null;

  onFileSelect(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const url = e.target.result;
      // set src
      this.cropImage.nativeElement.src = url;

      // reset transforms
      this.scale = 1;
      this.posX = 0;
      this.posY = 0;

      // wait image load to read natural size and center it
      this.cropImage.nativeElement.onload = () => {
        this.imgNaturalWidth = this.cropImage.nativeElement.naturalWidth;
        this.imgNaturalHeight = this.cropImage.nativeElement.naturalHeight;

        // Fit image initially to cover viewport (cover behavior)
        const vp = this.viewport.nativeElement.clientWidth; // square
        const scaleX = vp / this.imgNaturalWidth;
        const scaleY = vp / this.imgNaturalHeight;
        // choose max to cover whole viewport
        this.scale = Math.max(scaleX, scaleY);

        // center image
        const renderedW = this.imgNaturalWidth * this.scale;
        const renderedH = this.imgNaturalHeight * this.scale;
        this.posX = (vp - renderedW) / 2;
        this.posY = (vp - renderedH) / 2;

        this.applyTransform();
      };

      // show modal
      const el = document.getElementById('avatarModal')!;
      this.modalInstance = new bootstrap.Modal(el);
      this.modalInstance.show();

      // attach pointer listeners
      this.bindPointerEvents();
    };
    reader.readAsDataURL(file);
  }

  applyTransform() {
    const el = this.cropImage.nativeElement;
    el.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
  }

  onZoom(e: any) {
    const newScale = parseFloat(e.target.value);
    // to zoom around center we can adjust pos so visible area stays similar
    const vp = this.viewport.nativeElement;
    const rect = vp.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // compute image coords of center before zoom
    const imageCoordBeforeX = (cx - this.posX) / this.scale;
    const imageCoordBeforeY = (cy - this.posY) / this.scale;

    // update scale
    this.scale = newScale;

    // compute new pos so that imageCoordBefore maps to same center pixel
    this.posX = cx - imageCoordBeforeX * this.scale;
    this.posY = cy - imageCoordBeforeY * this.scale;

    this.clampPosition();
    this.applyTransform();
  }

  bindPointerEvents() {
    const imgEl = this.viewport.nativeElement;

    const down = (ev: PointerEvent) => {
      (ev.target as Element).setPointerCapture(ev.pointerId);
      this.dragging = true;
      this.startX = ev.clientX;
      this.startY = ev.clientY;
      this.startPosX = this.posX;
      this.startPosY = this.posY;
    };
    const move = (ev: PointerEvent) => {
      if (!this.dragging) return;
      const dx = ev.clientX - this.startX;
      const dy = ev.clientY - this.startY;
      this.posX = this.startPosX + dx;
      this.posY = this.startPosY + dy;
      this.clampPosition();
      this.applyTransform();
    };
    const up = (ev: PointerEvent) => {
      this.dragging = false;
      try { (ev.target as Element).releasePointerCapture(ev.pointerId); } catch { }
    };

    imgEl.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    // remove when modal closed
    const el = document.getElementById('avatarModal')!;
    el.addEventListener('hidden.bs.modal', () => {
      imgEl.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    }, { once: true });
  }

  // prevent leaving empty areas: ensure image covers viewport (no white gaps)
  clampPosition() {
    const vpSize = this.viewport.nativeElement.clientWidth;
    const renderedW = this.imgNaturalWidth * this.scale;
    const renderedH = this.imgNaturalHeight * this.scale;

    // min/max posX so image covers viewport
    const minX = Math.min(0, vpSize - renderedW);
    const maxX = Math.max(0, vpSize - renderedW); // usually positive only if image smaller
    // Actually we want image to be able to move but not leave gaps:
    const leftLimit = Math.min(0, vpSize - renderedW);
    const rightLimit = Math.max(0, vpSize - renderedW);
    // but simpler:
    if (renderedW >= vpSize) {
      // image bigger: allow translation between [vpSize - renderedW, 0]
      this.posX = Math.max(vpSize - renderedW, Math.min(0, this.posX));
    } else {
      // image smaller than viewport: center it
      this.posX = (vpSize - renderedW) / 2;
    }

    if (renderedH >= vpSize) {
      this.posY = Math.max(vpSize - renderedH, Math.min(0, this.posY));
    } else {
      this.posY = (vpSize - renderedH) / 2;
    }
  }

  closeModal() {
    this.modalInstance?.hide();
  }

  confirmAvatar() {
    const vp = this.viewport.nativeElement;
    const vpSize = vp.clientWidth; // same height

    let sx = (-this.posX) / this.scale;
    let sy = (-this.posY) / this.scale;
    let sWidth = vpSize / this.scale;
    let sHeight = vpSize / this.scale;


    sx = Math.max(0, Math.min(this.imgNaturalWidth - sWidth, sx));
    sy = Math.max(0, Math.min(this.imgNaturalHeight - sHeight, sy));
    if (sWidth > this.imgNaturalWidth) sWidth = this.imgNaturalWidth;
    if (sHeight > this.imgNaturalHeight) sHeight = this.imgNaturalHeight;

    // draw to canvas 128x128
    const target = 128;
    const canvas = document.createElement('canvas');
    canvas.width = target;
    canvas.height = target;
    const ctx = canvas.getContext('2d')!;

    // draw portion from the natural image
    const imgEl = this.cropImage.nativeElement;

    // Important: we must draw from image natural pixels, so use imgEl.naturalWidth/naturalHeight.
    ctx.drawImage(
      imgEl,
      sx, sy, sWidth, sHeight, // source rect (natural px)
      0, 0, target, target     // dest rect (canvas)
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      // patch form control
      this.registerForm.patchValue({ avatar: file });
      console.log('Resized & cropped avatar:', file);

      // optionally create preview url
      const url = URL.createObjectURL(blob);
      this.closeModal();

      // you can store or show avatarPreview
      // this.avatarPreview = url;
    }, 'image/jpeg', 0.9);
  }





}

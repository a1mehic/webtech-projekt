import { Component, OnInit} from '@angular/core';

import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import { mimeType } from './mime-type.validator';
import { PostsService } from '../posts-service';
import { Post } from '../post-model';


// hier Sachen definieren wie das Template
@Component({
selector: 'app-post-create',
templateUrl: './post-create.component.html',
styleUrls: ['./post-create.component.css']
})


export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  mode = 'create';
  postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, { validators: [Validators.required]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]})

    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true; // solange wir keinen Daten erhalten wollen wir den Spinner anzeigen
        this.postsService.getPost(this.postId).subscribe(
          postData => {
            this.isLoading = false; // sobald wir die Daten haben blenden wir ihn aus
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            };
            // setzen hier die Werte, für den zu bearbeitenden Post
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    // as HTMLInputElement sagt einfach das ganze ist ein Html input elem
    // 0 wir nehmen das erste Elem, welches das file ist welches der User selektiert hat
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    console.log(file);
    console.log(this.form);

    // Img umwandeln so das es angezeigt werden kann. Dafür brauchen wir die URL
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file);
  }

 onSavePost(form: NgForm) {
  if (this.form.invalid) {
    return;
  }
  this.isLoading = true;
  if (this.mode === 'create') { // möchten eine neue  Nachricht anlegen
    this.postsService.addPost(
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
      );
  } else {
    this.postsService.updatePost(
      this.postId,
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
    );
  }
  this.form.reset(); // Entfernt den Inhalt beim Form nachdem der Post hinzugefügt worden ist
 }
}

import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  //TODO: turn this var into enum
  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(public ps: PostsService,
    public route: ActivatedRoute,
    public router: Router,
    public auth: AuthService) { }

  ngOnInit() {

    this.authStatusSub = this.auth.getAuthStatusAsListener().subscribe(
      authStatus => this.isLoading = false
    );

    this.form = new FormGroup({
      title: new FormControl(null, 
        {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, 
        {validators: [Validators.required]}),
      image: new FormControl(null, 
        {validators: [Validators.required], 
          asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        this.ps.getPost(this.postId).subscribe( postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id, 
            title: postData.title, 
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          })
        });

      } else {
        this.mode = 'create';
        this.postId = null;
      }

    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create'){
      this.ps.addPost(this.form.value.title, 
        this.form.value.content, 
        this.form.value.image);
    } else {
      this.ps.updatePost(this.postId, 
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();   // runs validators

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

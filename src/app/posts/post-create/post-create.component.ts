import { PostsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  //TODO: turn this var into enum
  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading = false;

  constructor(public ps: PostsService,
    public route: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        this.ps.getPost(this.postId).subscribe( postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });

      } else {
        this.mode = 'create';
        this.postId = null;
      }

    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create'){
      this.ps.addPost(form.value.title, form.value.content);
    } else {
      this.ps.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }
}

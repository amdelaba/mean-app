import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private subscription: Subscription;
  isLoading = false;

  constructor(private ps: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.ps.getPosts();
    this.subscription =  this.ps.getPostUpdateListener()
      .subscribe((updatedPosts: Post[]) => {
        this.posts = updatedPosts;
        this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.ps.deletePost(postId);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}

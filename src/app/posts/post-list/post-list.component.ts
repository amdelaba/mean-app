import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,l OnDestroy {

  posts: Post[] = [];
  private subscription: Subscription;

  constructor(private ps: PostsService) { }

  ngOnInit() {
    this.posts = this.ps.getPosts();
    this.subscription =  this.ps.getPostUpdateListener()
      .subscribe((updatedPosts: Post[]) => {
        this.posts = updatedPosts;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

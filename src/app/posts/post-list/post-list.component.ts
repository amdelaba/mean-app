import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private subscription: Subscription;
  isLoading = false;

  totalPosts = 0;
  postsPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private ps: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.subscription =  this.ps.getPostUpdateListener()
      .subscribe( ( postData: {posts: Post[], postCount: number} ) => {
        this.posts = postData.posts;
        this.isLoading = false;
        this.totalPosts = postData.postCount;
      });
    this.ps.getPosts(this.postsPerPage, this.currentPage);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1; //+1 because pageIndex starts at 0
    this.postsPerPage = pageData.pageSize;
    this.ps.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.ps.deletePost(postId).subscribe(() => {
      this.ps.getPosts(this.postsPerPage, this.currentPage);
    })
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}

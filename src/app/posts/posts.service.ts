import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPosts(){
        // return this.posts.slice();
        return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
    
    addPost(post:Post){
        this.posts.push({title: post.title, content: post.content});
        this.postsUpdated.next([...this.posts])
    }
}
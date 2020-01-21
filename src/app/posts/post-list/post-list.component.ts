import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';

import {Post} from '../post-model';
import { PostsService } from '../posts-service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
selector: 'app-post-list',
templateUrl: './post-list.component.html',
styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
 // posts = [
   // {title: 'Erster Post', content: 'Das ist der erste Post'},
   // {title: 'Zweiter Post', content: 'Das ist der zweite Post' },
   // {title: 'Dritter Post', content: 'Das ist der dritte Post' }
 // ];

posts: Post[] = [];
isLoading = false;
totalPosts = 0;
postsPerPage = 2;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];
userIsAuthenticated = false;
userId: string;
private postsStub: Subscription;
private authStatusSub: Subscription;


 constructor(public postsService: PostsService, private authService: AuthService) {}
 // mit dem keyword public erstelle ich automatisch eine neue Property in dieser Komponente und
 // speichert den einkommenden Wert hinein

 ngOnInit() {
   this.isLoading = true;
   this.postsService.getPosts(this.postsPerPage, this.currentPage);
   this.userId = this.authService.getUserId();
   this.postsStub = this.postsService
   .getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
      this.userId = this.authService.getUserId();
     });
   this.userIsAuthenticated = this.authService.getIsAuth();
   this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
   });
 }

onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1; // +1 da es mit 0 anfängt
  this.postsPerPage = pageData.pageSize;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);

  // console.log(pageData);
}

onDelete(postId: string) {
  this.isLoading = true;
  this.postsService.deletePost(postId).subscribe(() => {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    // fetchen neue Posts sobald wir ein Post gelöscht haben
  });
}

 ngOnDestroy() {
   this.postsStub.unsubscribe();
   this.authStatusSub.unsubscribe();
 }
}

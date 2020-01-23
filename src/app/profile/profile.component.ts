import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';

import {Post} from '../posts/post-model';
import { PostsService } from '../posts/posts-service';
import { AuthService } from 'src/app/auth/auth.service';


// hier Sachen definieren wie das Template
@Component({
selector: 'app-user-profile',
templateUrl: './profile.component.html',
styleUrls: ['./profile.component.css']
})


export class UserProfile{

    
posts: Post[] = [];
isLoading = false;
totalPosts = 0;
postsPerPage = 10;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];
userIsAuthenticated = false;
userId: string;
private postsStub: Subscription;
private authStatusSub: Subscription;
filterargs = {"creator" : ''};



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
   this.filterargs = {"creator" : this.userId};
 }

onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  console.log(this.userId);
  this.currentPage = pageData.pageIndex + 1; // +1 da es mit 0 anfängt
  this.postsPerPage = pageData.pageSize;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);

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
 
  public searchChange(): void {
    this.filterargs = {"creator" : this.userId};
 } 
 

}

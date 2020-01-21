import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Post} from './post-model';


@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http
    .get<{posts: any; maxPosts: number}>(
      'http://localhost:3000/posts' + queryParams)
    // pipe erlaubt multiple operators
    .pipe(map((postData) => {
      return {
        posts: postData.posts.map(post => {
        // erstellen für jede Nachricht ein neues Objekt
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts
    };
    })
    )
    .subscribe( (transformedPostData) => {
      this.posts = transformedPostData.posts;
      // ich save die einkommenden Daten in mein array. dies können wir tun da wir wissen sie haben
      // das gleiche format und struktur
      // wir müssen json in javascript zurück umwandeln, da dies das get für uns macht
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
        });
      // wir müssen unsere App über das update informieren und das machen wir mit postsupdated
      // erstellen ein javascript object welches die Kopie von posts beinhaltet & die Anzahl

    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(
      'http://localhost:3000/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
   // const post: Post = {id: null, title, content};
    const postData = new FormData(); // ein Datenformat welches uns erlaubt textwerte und filewerte zu kombinieren
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post< {message: string; post: Post}>('http://localhost:3000/posts', postData)
      // nur für erfolgreiche response
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);

    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put('http://localhost:3000/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
   return this.http.delete('http://localhost:3000/posts/' + postId);
  }
}

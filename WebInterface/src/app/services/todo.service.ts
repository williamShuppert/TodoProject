import { JSDocTagName } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITodoListItem } from '../interfaces/todo-list-item';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private authService: AuthService) { }
  
  getList(listId: number) {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists/${listId}`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      })
    }).then(res => res.json()).then(res => {
      return res;
    }).catch(err => {
      return [];
    })
  }

  getLists() {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      })
    }).then(res => res.json()).then(res => {
      return res;
    }).catch(err => {
      return [];
    })
  }

  getListItems(listId: number) {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists/${listId}/Items`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      })
    }).then(res => res.json()).then(res => {
      return res;
    }).catch(err => {
      return [];
    })
  }

  addListItem(listId: number, content: string) {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists/${listId}/Items`, {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      }),
      body: JSON.stringify({
        content,
        displayOrder: 0
      })
    }).then(res => res.json()).then(res => {
      return res;
    })
  }

  updateListItem(todoListItem: ITodoListItem) {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists/${todoListItem.listId}/Items/${todoListItem.id}`, {
      method: 'PATCH',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      }),
      body: JSON.stringify({
        content: todoListItem.content,
        displayOrder: 0,
        isComplete: todoListItem.isComplete
      })
    });
  }

  deleteListItem(listId: number, itemId: number) {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists/${listId}/Items/${itemId}`, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      })
    });
  }

  addList(name: string) {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists`, {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      }),
      body: JSON.stringify({
        name
      })
    }).then(res => {
      if (res.status != 200) throw new Error('add failed');
      return res.json();
    });
  }

  updateList(name: string, listId: number) {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists/${listId}`, {
      method: 'PATCH',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      }),
      body: JSON.stringify({
        name
      })
    }).then(res => {
      if (res.status != 200) throw new Error('update failed');
    });
  }

  deleteList(listId: number) {
    return fetch(`${environment.baseApiUrl}/api/Todo/Lists/${listId}`, {
      method: 'DELETE',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': 'bearer ' + this.authService.getAuthJWT()
      })
    }).then(res => {
      if (res.status != 200) throw new Error('update failed');
    });
  }
}

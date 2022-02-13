import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem('jwt');
        const urlGeo = req.url.match('geoapify');
        if (token && urlGeo === null) {
            const authReq = req.clone({
                headers: req.headers.set('authorization', token),
            })
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }
}

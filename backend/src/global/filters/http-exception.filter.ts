import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";

export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus
        ? exception.getStatus()
        : 500;
        
        response.status(status).json({
            code: status,
            timestamp: new Date().toISOString(),
            path: ctx.getRequest().url,
            error: exception.message
        })
    }
}
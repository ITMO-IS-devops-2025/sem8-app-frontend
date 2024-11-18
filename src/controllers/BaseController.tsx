export class ErrorResponse {
    code: number
    text: string
    constructor(status: number, text: string) {
        this.code = status
        this.text = text
    }
}
export class BaseController {

    async api<T>(url: string, body: any = null, method: string = "GET"): Promise<T | ErrorResponse> {
        let response = await this.request("http://localhost:8080/api/v1/" + url, body, method)
        return response.ok ? JSON.parse(await response.text()) as T :
            new ErrorResponse(response.status, await response.text())
    }

    async request(url: string, body: any, method: string) {
        let headers: Headers = new Headers({
            'Content-Type': 'application/json'
        });
        if (localStorage["token"] != null) {
            headers.append("Authorization", "Bearer " + localStorage["token"])
        }
        const options: RequestInit = {
            headers: headers,
            method: method,
            mode: 'cors'
        };
        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        return await fetch(url, options);
    }

}
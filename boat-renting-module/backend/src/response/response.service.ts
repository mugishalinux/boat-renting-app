import { HttpStatus, Injectable } from "@nestjs/common";
import { ResponseDto } from "./response.dto";

@Injectable()
export class ResponseService {
  postResponse(id: number): ResponseDto {
    const response = new ResponseDto();
    response.status = HttpStatus.CREATED;
    response.message = "successfully created";
    response.id = id;
    return response;
  }
  updateResponse(id: number): ResponseDto {
    const response = new ResponseDto();
    response.status = HttpStatus.CREATED;
    response.message = "successfully updated";
    response.id = id;
    return response;
  }
  deleteResponse(id: number): ResponseDto {
    const response = new ResponseDto();
    response.status = HttpStatus.OK;
    response.message = "successfully deleted";
    response.id = id;
    return response;
  }
}

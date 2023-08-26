import { ForbiddenException, Injectable } from "@nestjs/common";
import { In, Not } from "typeorm";

@Injectable()
export class FilterHelper {
  async paginate(
    entity,
    pageSize?: number,
    pageNumber?: number,
    filter = {},
    relations = [],
    orderColumn = "created_at",
  ): Promise<any> {
    const filteringObject = {};
    for (const key in filter) {
      if (filter[key] != null) filteringObject[key] = filter[key];
    }
    console.log("Object:", filteringObject);

    if (pageSize && pageNumber) {
      const take = pageSize || 10;
      const page = Number(pageNumber) || 1;
      const skip = (page - 1) * take;
      const [list, total] = await entity.findAndCount({
        where: filteringObject,
        order: {
          [orderColumn]: orderColumn == "created_at" ? "DESC" : "ASC",
        },
        take,
        skip,
        relations,
      });
      const lastPage = Math.ceil(total / take);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;
      return {
        status: "success",
        list,
        total,
        previousPage: prevPage,
        nextPage,
        lastPage,
        currentPage: page,
      };
    } else {
      return await entity.find({
        where: filteringObject,
        relations,
      });
    }
  }
}

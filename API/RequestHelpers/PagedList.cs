using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            Metadata = new PaginationMetadata
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPage = (int)Math.Ceiling(count / (double)pageSize)
                //Math.Ceiling => round up, count=products count / eg. 10 products for each page => return 2
            };
            AddRange(items);
        }
        public PaginationMetadata Metadata{get; set;}
        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query,
        int pageNumber, int pageSize)
        {
            var count = await query.CountAsync(); // await needed for CountAsync -> getting data from DB
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            //skip records -> 1st page, skip 0 and display , page 1, skip the 1st page records and display next records
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelpers
{
    public class PaginationMetadata
    {
        public int TotalCount {get; set;}
        public int PageSize{get; set;}
        public int CurrentPage{get; set;}
        public int TotalPage {get; set;}
    }
}
using System;
using System.Collections.Generic;

namespace Khunghinh.Api.Data.Entities;

public partial class CaiDatHeThong
{
    public string Khoa { get; set; } = null!;

    public string GiaTri { get; set; } = null!;

    public string? GhiChu { get; set; }

    public DateTime NgayCapNhat { get; set; }
}

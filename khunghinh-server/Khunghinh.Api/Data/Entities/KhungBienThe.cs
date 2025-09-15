using System;
using System.Collections.Generic;

namespace Khunghinh.Api.Data.Entities;

public partial class KhungBienThe
{
    public long Id { get; set; }

    public long KhungHinhId { get; set; }

    public string TenBienThe { get; set; } = null!;

    public string AnhPngUrl { get; set; } = null!;

    public int ThuTu { get; set; }

    public string TrangThai { get; set; } = null!;

    public virtual KhungHinh KhungHinh { get; set; } = null!;
}

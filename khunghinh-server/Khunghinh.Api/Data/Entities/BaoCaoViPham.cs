using System;
using System.Collections.Generic;

namespace Khunghinh.Api.Data.Entities;

public partial class BaoCaoViPham
{
    public long Id { get; set; }

    public long KhungHinhId { get; set; }

    public long? NguoiBaoCaoId { get; set; }

    public string LyDo { get; set; } = null!;

    public string? MoTaThem { get; set; }

    public string TrangThaiXuLy { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual KhungHinh KhungHinh { get; set; } = null!;

    public virtual NguoiDung? NguoiBaoCao { get; set; }
}

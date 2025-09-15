using System;
using System.Collections.Generic;

namespace Khunghinh.Api.Data.Entities;

public partial class SuKienKhung
{
    public long Id { get; set; }

    public long KhungHinhId { get; set; }

    public long? NguoiDungId { get; set; }

    public string LoaiSuKien { get; set; } = null!;

    public DateTime ThoiDiem { get; set; }

    public string? IpHash { get; set; }

    public string? UserAgent { get; set; }

    public string? ThietBi { get; set; }

    public string? HeDieuHanh { get; set; }

    public string? TrinhDuyet { get; set; }

    public string? QuocGia { get; set; }

    public string? TinhThanh { get; set; }

    public string? ThanhPho { get; set; }

    public virtual KhungHinh KhungHinh { get; set; } = null!;

    public virtual NguoiDung? NguoiDung { get; set; }
}

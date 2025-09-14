using System;
using System.Collections.Generic;

namespace Khunghinh.Api.Data.Entities;

public partial class KhungHinh
{
    public long Id { get; set; }

    public long ChuSoHuuId { get; set; }

    public string TieuDe { get; set; } = null!;

    public string? MoTa { get; set; }

    public string Alias { get; set; } = null!;

    public string Loai { get; set; } = null!;

    public string CheDoHienThi { get; set; } = null!;

    public string TrangThai { get; set; } = null!;

    public string? UrlXemTruoc { get; set; }

    public string? QrImageUrl { get; set; }

    public DateTime NgayDang { get; set; }

    public DateTime? NgayChinhSua { get; set; }

    public long LuotXem { get; set; }

    public long LuotTai { get; set; }

    public virtual ICollection<BaoCaoViPham> BaoCaoViPhams { get; set; } = new List<BaoCaoViPham>();

    public virtual NguoiDung ChuSoHuu { get; set; } = null!;

    public virtual ICollection<KhungBienThe> KhungBienThes { get; set; } = new List<KhungBienThe>();

    public virtual ICollection<SuKienKhung> SuKienKhungs { get; set; } = new List<SuKienKhung>();

    public virtual ICollection<ThongKeNgay> ThongKeNgays { get; set; } = new List<ThongKeNgay>();
}

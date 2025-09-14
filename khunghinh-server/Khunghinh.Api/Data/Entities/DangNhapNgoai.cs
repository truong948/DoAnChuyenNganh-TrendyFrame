using System;
using System.Collections.Generic;

namespace Khunghinh.Api.Data.Entities;

public partial class DangNhapNgoai
{
    public long Id { get; set; }

    public long NguoiDungId { get; set; }

    public string NhaCungCap { get; set; } = null!;

    public string ProviderUserId { get; set; } = null!;

    public bool EmailXacThuc { get; set; }

    public string? AccessTokenHash { get; set; }

    public string? RefreshTokenHash { get; set; }

    public DateTime? LanCuoiDangNhap { get; set; }

    public virtual NguoiDung NguoiDung { get; set; } = null!;
}

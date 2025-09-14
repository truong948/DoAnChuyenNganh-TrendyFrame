using System;
using System.Collections.Generic;

namespace Khunghinh.Api.Data.Entities;

public partial class ThongKeNgay
{
    public DateOnly Ngay { get; set; }

    public long KhungHinhId { get; set; }

    public int Xem { get; set; }

    public int Tai { get; set; }

    public int DoiKhung { get; set; }

    public int QuetQr { get; set; }

    public virtual KhungHinh KhungHinh { get; set; } = null!;
}

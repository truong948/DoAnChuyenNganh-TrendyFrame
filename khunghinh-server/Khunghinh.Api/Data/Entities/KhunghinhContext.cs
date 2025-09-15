using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Khunghinh.Api.Data.Entities;

public partial class KhunghinhContext : DbContext
{
    public KhunghinhContext(DbContextOptions<KhunghinhContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BaoCaoViPham> BaoCaoViPhams { get; set; }

    public virtual DbSet<CaiDatHeThong> CaiDatHeThongs { get; set; }

    public virtual DbSet<DangNhapNgoai> DangNhapNgoais { get; set; }

    public virtual DbSet<KhungBienThe> KhungBienThes { get; set; }

    public virtual DbSet<KhungHinh> KhungHinhs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<SuKienKhung> SuKienKhungs { get; set; }

    public virtual DbSet<ThongKeNgay> ThongKeNgays { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BaoCaoViPham>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BaoCaoVi__3214EC07D41AC354");

            entity.ToTable("BaoCaoViPham");

            entity.HasIndex(e => e.TrangThaiXuLy, "IX_BCVP_TrangThai");

            entity.Property(e => e.LyDo).HasMaxLength(30);
            entity.Property(e => e.MoTaThem).HasMaxLength(500);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.TrangThaiXuLy)
                .HasMaxLength(15)
                .HasDefaultValue("cho_duyet");

            entity.HasOne(d => d.KhungHinh).WithMany(p => p.BaoCaoViPhams)
                .HasForeignKey(d => d.KhungHinhId)
                .HasConstraintName("FK_BCVP_KH");

            entity.HasOne(d => d.NguoiBaoCao).WithMany(p => p.BaoCaoViPhams)
                .HasForeignKey(d => d.NguoiBaoCaoId)
                .HasConstraintName("FK_BCVP_NBC");
        });

        modelBuilder.Entity<CaiDatHeThong>(entity =>
        {
            entity.HasKey(e => e.Khoa).HasName("PK__CaiDatHe__77B4176EDB10F59C");

            entity.ToTable("CaiDatHeThong");

            entity.Property(e => e.Khoa).HasMaxLength(120);
            entity.Property(e => e.GhiChu).HasMaxLength(255);
            entity.Property(e => e.NgayCapNhat).HasDefaultValueSql("(sysutcdatetime())");
        });

        modelBuilder.Entity<DangNhapNgoai>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DangNhap__3214EC07D6EA7822");

            entity.ToTable("DangNhapNgoai");

            entity.HasIndex(e => new { e.NhaCungCap, e.ProviderUserId }, "UQ_DNN").IsUnique();

            entity.Property(e => e.AccessTokenHash).HasMaxLength(255);
            entity.Property(e => e.EmailXacThuc).HasDefaultValue(true);
            entity.Property(e => e.NhaCungCap).HasMaxLength(20);
            entity.Property(e => e.ProviderUserId).HasMaxLength(255);
            entity.Property(e => e.RefreshTokenHash).HasMaxLength(255);

            entity.HasOne(d => d.NguoiDung).WithMany(p => p.DangNhapNgoais)
                .HasForeignKey(d => d.NguoiDungId)
                .HasConstraintName("FK_DNN_ND");
        });

        modelBuilder.Entity<KhungBienThe>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__KhungBie__3214EC074C69A756");

            entity.ToTable("KhungBienThe");

            entity.HasIndex(e => new { e.KhungHinhId, e.TrangThai, e.ThuTu }, "IX_KBT_Khung");

            entity.Property(e => e.AnhPngUrl).HasMaxLength(500);
            entity.Property(e => e.TenBienThe).HasMaxLength(120);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(10)
                .HasDefaultValue("hoat_dong");

            entity.HasOne(d => d.KhungHinh).WithMany(p => p.KhungBienThes)
                .HasForeignKey(d => d.KhungHinhId)
                .HasConstraintName("FK_KBT_KH");
        });

        modelBuilder.Entity<KhungHinh>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__KhungHin__3214EC07DCDC23BC");

            entity.ToTable("KhungHinh");

            entity.HasIndex(e => e.NgayDang, "IX_KH_NgayDang");

            entity.HasIndex(e => e.Alias, "UQ_KH_Alias").IsUnique();

            entity.Property(e => e.Alias).HasMaxLength(120);
            entity.Property(e => e.CheDoHienThi).HasMaxLength(20);
            entity.Property(e => e.Loai).HasMaxLength(20);
            entity.Property(e => e.MoTa).HasMaxLength(500);
            entity.Property(e => e.NgayDang).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.QrImageUrl).HasMaxLength(500);
            entity.Property(e => e.TieuDe).HasMaxLength(200);
            entity.Property(e => e.TrangThai).HasMaxLength(20);
            entity.Property(e => e.UrlXemTruoc).HasMaxLength(500);

            entity.HasOne(d => d.ChuSoHuu).WithMany(p => p.KhungHinhs)
                .HasForeignKey(d => d.ChuSoHuuId)
                .HasConstraintName("FK_KH_ND");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__NguoiDun__3214EC07AB0D67F6");

            entity.ToTable("NguoiDung", tb => tb.HasTrigger("trg_NguoiDung_Delete"));

            entity.HasIndex(e => e.Email, "UQ__NguoiDun__A9D10534D892FBAB").IsUnique();

            entity.Property(e => e.AnhDaiDienUrl).HasMaxLength(500);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.TenHienThi).HasMaxLength(120);
            entity.Property(e => e.TrangThai).HasMaxLength(20);
            entity.Property(e => e.VaiTro).HasMaxLength(10);
        });

        modelBuilder.Entity<SuKienKhung>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SuKienKh__3214EC0736C55AD3");

            entity.ToTable("SuKienKhung", tb => tb.HasTrigger("trg_SuKienKhung_AfterInsert"));

            entity.HasIndex(e => new { e.KhungHinhId, e.ThoiDiem }, "IX_SK_Khung_ThoiDiem");

            entity.HasIndex(e => e.LoaiSuKien, "IX_SK_Loai");

            entity.Property(e => e.HeDieuHanh).HasMaxLength(60);
            entity.Property(e => e.IpHash)
                .HasMaxLength(64)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.LoaiSuKien).HasMaxLength(12);
            entity.Property(e => e.QuocGia)
                .HasMaxLength(2)
                .IsFixedLength();
            entity.Property(e => e.ThanhPho).HasMaxLength(120);
            entity.Property(e => e.ThietBi).HasMaxLength(10);
            entity.Property(e => e.ThoiDiem).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.TinhThanh).HasMaxLength(120);
            entity.Property(e => e.TrinhDuyet).HasMaxLength(60);
            entity.Property(e => e.UserAgent).HasMaxLength(400);

            entity.HasOne(d => d.KhungHinh).WithMany(p => p.SuKienKhungs)
                .HasForeignKey(d => d.KhungHinhId)
                .HasConstraintName("FK_SK_KH");

            entity.HasOne(d => d.NguoiDung).WithMany(p => p.SuKienKhungs)
                .HasForeignKey(d => d.NguoiDungId)
                .HasConstraintName("FK_SK_ND");
        });

        modelBuilder.Entity<ThongKeNgay>(entity =>
        {
            entity.HasKey(e => new { e.Ngay, e.KhungHinhId }).HasName("PK_TK");

            entity.ToTable("ThongKeNgay");

            entity.HasOne(d => d.KhungHinh).WithMany(p => p.ThongKeNgays)
                .HasForeignKey(d => d.KhungHinhId)
                .HasConstraintName("FK_TK_KH");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

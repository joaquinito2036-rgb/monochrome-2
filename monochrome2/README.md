# Monochrome 2 foundation

This directory contains the lawful media-ingestion and transcoding foundation for Monochrome 2.

## Architecture

- **Cloudflare Pages**: the existing Vite client.
- **Cloudflare Workers**: catalog API, signed playback URLs and job submission.
- **Cloudflare R2**: source objects, encoded renditions, HLS and MPEG-DASH packages.
- **External workers**: FFmpeg/ffprobe, shntool, WavPack tools and optional SACD/DVD/Blu-ray extractors. CPU-heavy encoding does not run on Pages.
- **Queue/database**: job state, source provenance, rights status and media metadata.

## Source policy

Internet Archive records may be indexed automatically only when their metadata contains an allowlisted reusable license. Public-domain and compatible Creative Commons material are supported.

RuTracker is represented by an **administrator-supplied manifest provider**. It does not scrape the site, bypass access controls, search for protected works or download torrents. Every entry must state its rights basis and be approved before a processing job can be created.

## Initial API

```bash
cd monochrome2
npm install
npm test
npm run dev
```

- `GET /api/search/archive?q=...`
- `POST /api/catalog/manifest`
- `GET /api/profiles`

## Processing

A normalized source is probed before work begins. CUE/image-based albums are split into tracks where the operator has provided the necessary lawful source files. Lossless masters remain lossless; lossy sources are never labelled as master quality.

Audio targets include FLAC, AAC-LC, HE-AAC v1/v2, Opus and Vorbis. Video targets include H.264, HEVC, VP9 and AV1 with an explicit ladder from 144p through 2160p. HLS and DASH packaging is performed after encoding.

This is a foundation, not a production transcoder. Production deployments must add authentication, rate limits, malware scanning, durable queues, observability and storage lifecycle rules.

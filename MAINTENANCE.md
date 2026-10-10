# Keeping the site up to date

This site has no admin panel. Everything you see on it comes from files in the `src/content/` folder. You change the site by adding or editing those files on GitHub, then the site rebuilds itself and the new version is live about a minute later.

本站没有后台。网站上的所有内容都来自 `src/content/` 文件夹里的文件。在 GitHub 网页上添加或修改这些文件，网站会自动重新构建，大约一分钟后新版本就上线了。

You never need to touch anything outside `src/content/` and `public/video/`.
除了 `src/content/` 和 `public/video/`，其他文件都不用碰。

```
src/content/
  site.json            your name, tagline, About text, contact, hero photo
  films/               one .json per film + its poster image
  galleries/           one folder per photo series, photos inside, plus gallery.json
  awards/              one .json per award or festival selection
  press/               one .json per article about you (section appears when the first one exists)
  exhibitions/         one .json per exhibition (section appears when the first one exists)
```

---

## 1. Add photos to a series · 往一个系列里加照片

1. Open the repository on GitHub and go to `src/content/galleries/` → the series folder, e.g. `tibet/`.
2. Click **Add file → Upload files**, drag your JPGs in.
   - Export them at **2400 px on the long edge, JPEG quality 80–85**. Lightroom: Export → Image Sizing → Long Edge 2400. Don't upload RAW or 20 MB originals.
   - Name them so they sort in the order you want: `tibet-17.jpg`, `tibet-18.jpg` … (two digits; `tibet-100.jpg` also sorts correctly).
   - Strip location data when exporting (Lightroom: untick "Include GPS").
3. Scroll down, click **Commit changes**.
4. Wait a minute, refresh the site. Done.

打开 GitHub 仓库 → `src/content/galleries/` → 对应系列文件夹 → **Add file → Upload files** → 拖入照片（长边 2400px、JPEG 质量 80–85，文件名按想要的顺序编号）→ **Commit changes** → 等一分钟刷新。

To remove a photo: open the file on GitHub, click the trash icon, commit.
删除照片：在 GitHub 打开那个文件，点垃圾桶图标，commit。

## 2. Start a new series · 新建一个系列

1. In `src/content/galleries/`, click **Add file → Create new file**.
2. In the filename box type `beijing-night/gallery.json` (typing the `/` creates the folder). Use lowercase and dashes.
3. Paste this and edit it:

```json
{
  "title": "Beijing at Night",
  "description": "One sentence shown under the title.",
  "year": "2026",
  "location": "Beijing",
  "order": 6,
  "cover": "./beijing-night-01.jpg"
}
```

4. Commit. Then upload photos into that folder as in step 1. `order` controls where the series sits on the page (lower first). `cover` must be the filename of one of the photos in the folder.

## 3. Add a film · 加一部影片

1. Upload the film to YouTube (unlisted is fine). Copy the part of the link after `youtu.be/` — that is the `youtubeId`.
2. In `src/content/films/`, upload a poster image: a clean frame from the film, 1920 px wide, named like `my-film-poster.jpg`.
3. Click **Add file → Create new file**, name it `my-film.json`, paste the contents of `_example.json`, fill in the fields, set `"published": true`, commit.

Fields: `title`, `year`, `role` (Cinematographer / Director / Editor …), `youtubeId`, `poster` (`./my-film-poster.jpg`), `logline` (one sentence), `description` (paragraphs), `credits`, `runtime`, `order` (lower = higher on the page).

## 4. Add an award or festival selection · 加一个获奖或入围

In `src/content/awards/`, create `2026-05-festival-name.json`:

```json
{
  "title": "Best Cinematography",
  "category": "Student Shorts",
  "festival": "Festival Name",
  "location": "City, Country",
  "date": "2026-05",
  "work": "anna-s-diary",
  "role": "Cinematographer",
  "url": "https://festival-website.com",
  "image": "./2026-05-festival-name.jpg"
}
```

`work` is the film's filename without `.json`. `image` is optional — upload a photo of the certificate or laurel into the same folder and it will appear on the film's page. `date` is `YYYY-MM` or `YYYY` and controls the order.

## 5. Add press coverage or an exhibition · 加媒体报道或展览

Same idea: copy `_example.json` in `src/content/press/` or `src/content/exhibitions/` to a new file, fill it in, set `"published": true`. The section appears on the home page and in the CV automatically.

## 6. Change your bio, tagline or contact · 改简介、标语或联系方式

Open `src/content/site.json` on GitHub, click the pencil, edit the text, commit.
- `about` is a list of paragraphs. Keep the quotes and commas as they are.
- `contact.email`: put an address here and it replaces "Contact details forthcoming."
- `hero`: which photo is the big one at the top (`gallery` folder + `file` name).

## 7. Letting an AI do it · 让 AI 来做

Open this repository in Claude Code, Codex or Cursor and say what you want in plain language, for example "add a new series called Shanghai with the photos in my Downloads folder" or "add the award we got from X festival". It will edit the same files described above. Check the preview, then commit.

## If something breaks · 出错了怎么办

The site only breaks when a JSON file is malformed (a missing comma or quote) or points to an image that doesn't exist. GitHub shows a red ✗ next to the commit and Vercel keeps the previous version online, so nothing is lost. Open the file, fix the typo, commit again. [jsonlint.com](https://jsonlint.com) will tell you where the comma is missing.

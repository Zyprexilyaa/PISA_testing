# PISA PDF Question Files

Place your 3 PISA PDF files in this folder.

The app currently expects these files by default:

- `pisa-old-test-1.pdf`
- `pisa-old-test-2.pdf`
- `pisa-old-test-3.pdf`

If your PDFs have different names, update `frontend/src/services/examQuestionService.ts` to match the filenames and titles.

Once these files are in place, the teacher page can reset the exam bank to only the 3 PDF questions.

import { PDFDocument, StandardFonts } from "pdf-lib";
export async function convertToPdf(): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { height, width } = page.getSize();

    const image1Url = "/images/head.png";
    const image1Bytes = await fetch(image1Url).then((res) => res.arrayBuffer());
    const image1 = await pdfDoc.embedPng(image1Bytes);
    const image1Dims = image1.scale(0.5);

    const image1X = (width - image1Dims.width) / 2;
    const image1Y = height - image1Dims.height + 30;

    page.drawImage(image1, {
      x: image1X + 50,
      y: image1Y,
      width: image1Dims.width - 120,
      height: image1Dims.height - 20,
    });

    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const drawWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      font: any,
      fontSize: number,
      lineHeight = 14
    ) => {
      const words = text.split(" ");
      let line = "";
      let cursorY = y;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (lineWidth > maxWidth && i > 0) {
          page.drawText(line.trim(), {
            x,
            y: cursorY,
            size: fontSize,
            font,
          });
          line = words[i] + " ";
          cursorY -= lineHeight;
        } else {
          line = testLine;
        }
      }

      if (line.length > 0) {
        page.drawText(line.trim(), { x, y: cursorY, size: fontSize, font });
      }

      return cursorY - lineHeight;
    };

    page.drawText(
      "Ref.No.: - MRSAC/Student-[College Name]/UG/[AutoGenrateNO8]/2025",
      { x: 30, y: image1Y - 10, size: 10, font: boldFont }
    );

    page.drawText("Date: 12-06-2025", {
      x: width - 120,
      y: image1Y - 20,
      size: 12,
      font: boldFont,
    });

    page.drawText("To,", {
      x: 30,
      y: image1Y - 40,
      size: 12,
      font: boldFont,
    });
    page.drawText("{Name-Data}", {
      x: 30,
      y: image1Y - 55,
      size: 12,
      font: boldFont,
    });
    page.drawText("Dean-Industry Relations,", {
      x: 30,
      y: image1Y - 70,
      size: 12,
      font: boldFont,
    });
    page.drawText("[College Name],", {
      x: 30,
      y: image1Y - 85,
      size: 12,
      font: boldFont,
    });
    page.drawText("Nagpur [Ad],", {
      x: 30,
      y: image1Y - 100,
      size: 12,
      font: boldFont,
    });

    drawWrappedText(
      "Sub: - Permission for the internship and guidance to the students from [CourseName (Artificial Intelligence Engineering Department)] (Sem (Seventh semester)) of [G.H.Raisoni College of Engineering, Nagpur] for partial fulfilment of their degree.",
      30,
      image1Y - 140,
      width - 60,
      boldFont,
      12,
      16
    );
    page.drawText("Ref: -    1. [GHRCE/IIP/2024-25/AI/443 dated: 09/06/2025]", {
      x: 30,
      y: image1Y - 230,
      size: 12,
      font: boldFont,
    });
    page.drawText("Dear Sir/Mam,", {
      x: 30,
      y: image1Y - 280,
      size: 12,
      font: boldFont,
    });

    drawWrappedText(
      "This is with the above reference letter, Student of [CourceName( Artificial Intelligence)] branch (Sem (Seventh semester)) of [G.H.Raisoni College of Engineering, Nagpur] is allowed to work at our centre as an intern from [16th June 2025 to 15th December 2025.]",
      30,
      image1Y - 320,
      width - 60,
      boldFont,
      12,
      16
    );
    page.drawText("1.	[ Mr. Jass Dandare ]", {
      x: 50,
      y: image1Y - 370,
      size: 12,
      font: boldFont,
    });
    page.drawText("Thanking You. ", {
      x: 50,
      y: image1Y - 390,
      size: 12,
      font: boldFont,
    });
    page.drawText("Yours,", {
      x: 460,
      y: image1Y - 420,
      size: 12,
      font: boldFont,
    });
    page.drawText("Sanjay Balamwar", {
      x: 440,
      y: image1Y - 470,
      size: 12,
      font: boldFont,
    });
    page.drawText("Associate Scientist ", {
      x: 440,
      y: image1Y - 485,
      size: 12,
      font: boldFont,
    });
    const image2Url = "/images/foot.png";
    const image2Bytes = await fetch(image2Url).then((res) => res.arrayBuffer());
    const image2 = await pdfDoc.embedPng(image2Bytes);
    const image2Dims = image2.scale(0.5);

    const image2X = (width - image2Dims.width) / 2;
    const image2Y = height - image2Dims.height + 30;

    page.drawImage(image2, {
      x: image2X + 50,
      y: image2Y - 730,
      width: image2Dims.width - 100,
      height: image2Dims.height - 20,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (err) {
    console.error("Error converting DOCX to PDF:", err);
    throw err;
  }
}

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
export async function convertToPdf(): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { height, width } = page.getSize();
    // ---------- GET CURRENT DATE ----------
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;
    const margin = 50;
    let cursorY = height - margin;

    const headerBytes = await fetch("/images/head.png").then((r) =>
      r.arrayBuffer()
    );
    const headerImage = await pdfDoc.embedPng(headerBytes);
    const headerDims = headerImage.scale(0.41);

    page.drawImage(headerImage, {
      x: (width - headerDims.width) / 2,
      y: cursorY - headerDims.height + 40,
      width: headerDims.width - 20,
      height: headerDims.height,
    });

    cursorY -= headerDims.height + 40;

    const regularFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const fontSizeNormal = 12;
    const lineHeight = 18;

    const drawWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      font: any,
      fontSize: number,
      lineHeight: number,
      color = rgb(0, 0, 0)
    ) => {
      const words = text.split(" ");
      let line = "";
      let cursor = y;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (lineWidth > maxWidth && i > 0) {
          page.drawText(line.trim(), {
            x,
            y: cursor,
            size: fontSize,
            font,
            color,
          });
          line = words[i] + " ";
          cursor -= lineHeight;
        } else {
          line = testLine;
        }
      }

      if (line.trim()) {
        page.drawText(line.trim(), {
          x,
          y: cursor,
          size: fontSize,
          font,
          color,
        });
        cursor -= lineHeight;
      }

      return cursor;
    };

    page.drawText("Ver: [16 digit no]", {
      x: margin,
      y: cursorY,
      size: 10,
      font: boldFont,
    });

    page.drawText(`Date: ${formattedDate}`, {
      x: width - 150,
      y: cursorY,
      size: 10,
      font: boldFont,
    });

    cursorY -= lineHeight * 2;

    const addressLines = [
      "To,",
      "{Name-Data}",
      "Head of the Department,",
      "[Computer Engineering],",
      "[College Name],",
      "Nagpur-441108,",
    ];

    for (const line of addressLines) {
      page.drawText(line, {
        x: margin,
        y: cursorY,
        size: fontSizeNormal,
        font: regularFont,
      });
      cursorY -= lineHeight;
    }

    cursorY -= 10;

    page.drawText(
      "Subject: Completion of Internship Work by UG Student - Bachelor of Engineering in Computer Engineering",
      {
        x: margin,
        y: cursorY,
        size: fontSizeNormal,
        font: boldFont,
      }
    );
    cursorY -= lineHeight * 2;

    page.drawText("Dear Sir/Madam,", {
      x: margin,
      y: cursorY,
      size: fontSizeNormal,
      font: regularFont,
    });
    cursorY -= lineHeight * 1.5;

    cursorY = drawWrappedText(
      "This is to certify that the internship project titled 'Secure Park' has been successfully completed by the following UG student of Bachelor of Engineering in Computer Engineering, College name, City at Maharashtra Remote Sensing Application Centre (MRSAC), Nagpur, during the period from January 2025 to May 2025:",
      margin,
      cursorY,
      width - margin * 2,
      regularFont,
      fontSizeNormal,
      lineHeight
    );

    cursorY -= 10;

    page.drawText("Ms. Shruti Vijay Kanfade", {
      x: margin + 20,
      y: cursorY,
      size: fontSizeNormal,
      font: boldFont,
    });
    cursorY -= lineHeight * 1.5;

    cursorY = drawWrappedText(
      "She has contributed effectively to various modules of the Secure Park Project, including AI integration, machine learning implementation, web development, and user interface design. Her performance during the internship was sincere and commendable. We wish her all the best in her future endeavors.",
      margin,
      cursorY,
      width - margin * 2,
      regularFont,
      fontSizeNormal,
      lineHeight
    );
    cursorY -= lineHeight * 3;

    const rightBlockX = width - 180;
    page.drawText("Regards,", {
      x: rightBlockX,
      y: cursorY,
      size: fontSizeNormal,
      font: regularFont,
    });

    cursorY -= lineHeight * 3;
    page.drawText("Sanjay Balamwar", {
      x: rightBlockX,
      y: cursorY,
      size: fontSizeNormal,
      font: boldFont,
    });
    cursorY -= lineHeight;
    page.drawText("(Associate Scientist)", {
      x: rightBlockX,
      y: cursorY,
      size: fontSizeNormal,
      font: regularFont,
    });

    const footerBytes = await fetch("/images/foot.png").then((r) =>
      r.arrayBuffer()
    );
    const footerImage = await pdfDoc.embedPng(footerBytes);
    const footerDims = footerImage.scale(0.41);
    page.drawImage(footerImage, {
      x: (width - footerDims.width) / 2,
      y: 10,
      width: footerDims.width,
      height: footerDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (err) {
    console.error("Error converting DOCX to PDF:", err);
    throw err;
  }
}

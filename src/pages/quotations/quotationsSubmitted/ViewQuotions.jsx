import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import moment from "moment";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ViewQuotions = () => {
  const [viewQuotions, setViewQuotions] = useState(null);
  const [viewSubQuotions, setViewSubQuotions] = useState(null);
  const [quotationSubSum, setQuotationSubSum] = useState([]);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const printRef = useRef();

  useEffect(() => {
    const fetchViewOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-quotation-view-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setViewQuotions(response.data?.quotation);
        setViewSubQuotions(response.data?.quotationSub);
        setQuotationSubSum(response.data?.quotationSubSum);
      } catch (error) {
        toast.error(error.response.data.message, error);
        console.error(error.response.data.message, error);
      } finally {
        setLoading(false);
      }
    };
    fetchViewOrder();
  }, [1]);

  // const whatsappPdf = async () => {
  //   try {
  //     setWhatsappLoading(true);
  //     const element = printRef.current;

  //     const options = {
  //       margin: 10,
  //       filename: "Quotation.pdf",
  //       image: { type: "jpeg", quality: 0.98 },
  //       html2canvas: {
  //         scale: 2,
  //         useCORS: true,
  //         windowHeight: element.scrollHeight,
  //       },
  //       jsPDF: {
  //         unit: "mm",
  //         format: "a4",
  //         orientation: "portrait",
  //       },
  //       pagebreak: { mode: "avoid-all" },
  //     };

  //     const pdfOutput = await html2pdf()
  //       .from(element)
  //       .set(options)
  //       .toPdf()
  //       .get("pdf");

  //     const pdfBlob = pdfOutput.output("blob");
  //     const file = new File([pdfBlob], "Quotation.pdf", {
  //       type: "application/pdf",
  //     });

  //     const message = `Quotation Details:\n\nClient: ${viewQuotions?.full_name || ""}\nQuotation No: ${viewQuotions?.quotation_no || ""}\nDate: ${viewQuotions?.quotation_date || ""}\n\nPlease find the attached quotation.`;

  //     if (
  //       navigator.share &&
  //       navigator.canShare &&
  //       navigator.canShare({ files: [file] })
  //     ) {
  //       await navigator.share({
  //         files: [file],
  //         text: message,
  //       });
  //       return;
  //     }

  //     const fileUrl = URL.createObjectURL(file);

  //     if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  //       if (navigator.share) {
  //         try {
  //           await navigator.share({
  //             text: message,
  //             url: fileUrl,
  //           });
  //           URL.revokeObjectURL(fileUrl);
  //           return;
  //         } catch (mobileShareError) {
  //           console.log("Mobile share failed:", mobileShareError);
  //         }
  //       }

  //       const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
  //       window.location.href = whatsappUrl;

  //       setTimeout(() => {
  //         const webWhatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  //         window.open(webWhatsappUrl, "_blank");
  //       }, 1000);

  //       URL.revokeObjectURL(fileUrl);
  //       return;
  //     }

  //     const webWhatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  //     window.open(webWhatsappUrl, "_blank");
  //   } catch (error) {
  //     console.error("Error in whatsappPdf:", error);
  //     alert("There was an error sharing the PDF. Please try again.");
  //   }finally {
  //     setWhatsappLoading(false);
  //   }
  // };
  const whatsappPdf = async () => {
    try {
      setWhatsappLoading(true);
      const element = printRef.current;

      const options = {
        margin: 10,
        filename: "Quotation.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          windowHeight: element.scrollHeight,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: "avoid-all" },
      };

      const pdfOutput = await html2pdf()
        .from(element)
        .set(options)
        .toPdf()
        .get("pdf");

      const pdfBlob = pdfOutput.output("blob");
      const file = new File([pdfBlob], "Quotation.pdf", {
        type: "application/pdf",
      });

      const message = `Quotation Details:\n\nClient: ${viewQuotions?.full_name || ""}\nQuotation No: ${viewQuotions?.quotation_no || ""}\nDate: ${viewQuotions?.quotation_date || ""}\n\nPlease find the attached quotation.`;

      alert("PDF generated successfully!");

      if (navigator.share) {
        try {
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              text: message,
            });
            return;
          } else {
            const fileUrl = URL.createObjectURL(file);
            await navigator.share({
              text: message,
              url: fileUrl,
            });
            URL.revokeObjectURL(fileUrl);
            return;
          }
        } catch (shareError) {
          console.log(
            "Navigator share failed, falling back to WhatsApp:",
            shareError,
          );
        }
      }

      const encodedMessage = encodeURIComponent(message);

      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
        window.location.href = whatsappUrl;

        setTimeout(() => {
          const webWhatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
          window.open(webWhatsappUrl, "_blank");
        }, 1500);
      } else {
        const webWhatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
        window.open(webWhatsappUrl, "_blank");
      }
    } catch (error) {
      console.error("Error in whatsappPdf:", error);
      alert("There was an error sharing the PDF. Please try again.");
    } finally {
      setWhatsappLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-56">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!viewQuotions) {
    return (
      <Layout>
        <div className="flex justify-center flex-col mt-48 items-center h-56">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <div className="text-gray-400 animate-pulse">Loading</div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="p-4  bg-white h-screen w-full mx-auto ">
        <div className=" flex flex-row items-center justify-between gap-2 mb-4">
          <Link to="/quotations">
            <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
          </Link>
          <div className="flex flex-row items-center gap-2">
            <ReactToPrint
              trigger={() => (
                <button className=" bg-blue-500 text-white py-2 px-4 rounded">
                  Print Quotation
                </button>
              )}
              content={() => printRef.current}
            />

            <button
              className="bg-green-500 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={whatsappPdf}
              disabled={whatsappLoading}
            >
              {whatsappLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "WhatsApp"
              )}
            </button>
          </div>
        </div>

        <div ref={printRef} className="print-container  ">
          <div className="grid grid-cols-3 gap-4 mb-6 border-b pb-4">
            <div>
              <p className="font-semibold text-black">Client:</p>
              <p className="text-black">{viewQuotions.full_name}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-black">Quote No:</p>
              <p className="text-black">{viewQuotions.quotation_no}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-black">Quote Date:</p>
              <p className="text-black">
                {moment(viewQuotions.quotation_date).format("DD-MM-YYYY")}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <table className="min-w-full table-auto border border-black">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2 border border-black">Item</th>
                  <th className="text-left p-2 border border-black">Size</th>
                  <th className="text-left p-2 border border-black">
                    Quantity
                  </th>
                  <th className="text-left p-2 border border-black">Rate</th>
                  <th className="text-left p-2 border border-black">Amount</th>
                </tr>
              </thead>
              <tbody>
                {viewSubQuotions?.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-black">
                      {item.quotation_sub_thickness} - {item.quotation_sub_unit}{" "}
                      {item.product_category} {item.product_sub_category}
                      <p className="text-sm text-black">
                        Brand: {item.quotation_sub_brand}
                        <br />
                        {item.quotation_sub_design_no}
                      </p>
                    </td>
                    <td className="p-2 border border-black">
                      {item.quotation_sub_size1 > 1
                        ? item.quotation_sub_size2 > 1
                          ? item.quotation_sub_size1 +
                            "x" +
                            item.quotation_sub_size2
                          : ""
                        : ""}
                    </td>
                    <td className="p-2 border border-black">
                      {item.quotation_sub_quantity}
                    </td>
                    <td className="p-2 border border-black">
                      {/* {item.quotation_sub_rate.toFixed(2)} */}
                      {(Number(item.quotation_sub_rate) || 0).toFixed(2)}
                    </td>
                    <td className="p-2 border border-black">
                      {/* {item.quotation_sub_amount.toFixed(2)} */}
                      {(Number(item.quotation_sub_amount) || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-4 border border-black font-semibold">
                    Billing on Address
                  </td>
                  <td className="p-2 border border-black font-bold">Total </td>

                  <td
                    className="p-2 border border-black font-semibold text-center"
                    colSpan={3}
                  >
                    {/* {quotationSubSum.toFixed(2)} */}
                    {(Number(quotationSubSum) || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {(viewQuotions?.quotation_shipping ||
            viewQuotions?.quotation_delivery) && (
            <div className="mt-4 flex flex-row gap-4">
              <div className="h-20 border border-black bg-white w-1/2">
                <textarea
                  className="w-full h-full resize-none p-2 text-sm text-black outline-none bg-transparent"
                  placeholder="Delivery Address"
                  readOnly
                  value={viewQuotions?.quotation_delivery || ""}
                />
              </div>

              <div className="h-20 border border-black bg-white w-1/2">
                <textarea
                  className="w-full h-full resize-none p-2 text-sm text-black outline-none bg-transparent"
                  placeholder="Billing Address"
                  readOnly
                  value={viewQuotions?.quotation_shipping || ""}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
        @media print {
          @page {
            size: A5;
            margin: 10mm;
          }

          .print-container {
            font-size: 12px;
            color: black;
          }

          .print-container h1 {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .print-container p {
            margin: 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          table, th, td {
            border: 1px solid black;
          }

          th, td {
            padding: 8px;
            text-align: left;
          }

          thead {
            background-color: #f0f0f0;
          }

          tbody tr:nth-child(even) {
            background-color: white; 
          }

          tbody tr:nth-child(odd) {
            background-color: white;
          }
        }
      `}
      </style>
    </Layout>
  );
};

export default ViewQuotions;

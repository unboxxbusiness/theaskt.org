"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSanityImageUrl } from "@/lib/sanity";
import Typography from "../typography/Typography";

// Helper to group consecutive list item blocks of the same type together
function groupConsecutiveLists(blocks: any[]): any[] {
  const result: any[] = [];
  let currentList: { type: string; items: any[] } | null = null;

  for (const block of blocks) {
    if (block._type === 'block' && block.listItem) {
      if (currentList && currentList.type === block.listItem) {
        currentList.items.push(block);
      } else {
        if (currentList) {
          result.push({ _type: 'listGroup', listItem: currentList.type, children: currentList.items });
        }
        currentList = { type: block.listItem, items: [block] };
      }
    } else {
      if (currentList) {
        result.push({ _type: 'listGroup', listItem: currentList.type, children: currentList.items });
        currentList = null;
      }
      result.push(block);
    }
  }

  if (currentList) {
    result.push({ _type: 'listGroup', listItem: currentList.type, children: currentList.items });
  }

  return result;
}

export default function CustomPortableText({ value }: { value: any[] | null | undefined }) {
  if (!value || !Array.isArray(value)) return null;

  const groupedBlocks = groupConsecutiveLists(value);

  return (
    <div className="space-y-6">
      {groupedBlocks.map((block: any, index: number) => {
        // Render Grouped Bullet/Number Lists
        if (block._type === 'listGroup') {
          const Tag = block.listItem === 'bullet' ? 'ul' : 'ol';
          const listClass = block.listItem === 'bullet' 
            ? 'list-disc pl-6 space-y-2.5 my-4 text-text-body font-sans' 
            : 'list-decimal pl-6 space-y-2.5 my-4 text-text-body font-sans';
          return (
            <Tag key={index} className={listClass}>
              {block.children.map((item: any, itemIdx: number) => {
                const itemChildren = item.children || [];
                const renderItemChildren = () => {
                  return itemChildren.map((span: any, sIdx: number) => {
                    let content = span.text;
                    if (span.marks && span.marks.length > 0) {
                      // Inline Links resolution from list item markDefs
                      const linkDef = item.markDefs?.find((def: any) => span.marks.includes(def._key));
                      if (linkDef && linkDef._type === 'link') {
                        const isInternal = linkDef.href?.startsWith('/') || linkDef.href?.includes('theaskt.com');
                        const href = linkDef.href || '#';
                        if (isInternal) {
                          content = (
                            <Link 
                              key={sIdx} 
                              href={href} 
                              className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4"
                            >
                              {content}
                            </Link>
                          );
                        } else {
                          content = (
                            <a 
                              key={sIdx} 
                              href={href} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4"
                            >
                              {content}
                            </a>
                          );
                        }
                      }
                      
                      if (span.marks.includes('strong')) content = <strong key={sIdx} className="font-bold text-text-h">{content}</strong>;
                      if (span.marks.includes('em')) content = <em key={sIdx} className="italic">{content}</em>;
                      if (span.marks.includes('code')) {
                        content = (
                          <code key={sIdx} className="bg-bg-code border border-border-primary px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-text-h">
                            {content}
                          </code>
                        );
                      }
                    }
                    return <span key={sIdx}>{content}</span>;
                  });
                };
                return (
                  <li key={itemIdx} className="text-sm sm:text-base leading-relaxed text-left">
                    {renderItemChildren()}
                  </li>
                );
              })}
            </Tag>
          );
        }

        if (block._type === 'block') {
          const style = block.style || 'normal';
          const children = block.children || [];

          const renderChildren = () => {
            return children.map((span: any, sIdx: number) => {
              let content = span.text;
              if (span.marks && span.marks.length > 0) {
                // Inline Links resolution from block markDefs
                const linkDef = block.markDefs?.find((def: any) => span.marks.includes(def._key));
                if (linkDef && linkDef._type === 'link') {
                  const isInternal = linkDef.href?.startsWith('/') || linkDef.href?.includes('theaskt.com');
                  const href = linkDef.href || '#';
                  if (isInternal) {
                    content = (
                      <Link 
                        key={sIdx} 
                        href={href} 
                        className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4"
                      >
                        {content}
                      </Link>
                    );
                  } else {
                    content = (
                      <a 
                        key={sIdx} 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4"
                      >
                        {content}
                      </a>
                    );
                  }
                }

                if (span.marks.includes('strong')) content = <strong key={sIdx} className="font-bold text-text-h">{content}</strong>;
                if (span.marks.includes('em')) content = <em key={sIdx} className="italic">{content}</em>;
                if (span.marks.includes('code')) {
                  content = (
                    <code key={sIdx} className="bg-bg-code border border-border-primary px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-text-h">
                      {content}
                    </code>
                  );
                }
              }
              return <span key={sIdx}>{content}</span>;
            });
          };

          if (style === 'h1') return <Typography variant="h1" key={index} className="pt-8 text-text-h font-serif font-extrabold text-left">{renderChildren()}</Typography>;
          if (style === 'h2') return <Typography variant="h2" key={index} className="pt-6 text-text-h font-serif font-bold text-left">{renderChildren()}</Typography>;
          if (style === 'h3') return <Typography variant="h3" key={index} className="pt-4 text-text-h font-serif font-bold text-left">{renderChildren()}</Typography>;
          if (style === 'blockquote') {
            return (
              <blockquote key={index} className="border-l-4 border-[#FCA311] pl-5 italic text-text-secondary my-6 text-base leading-[1.8] font-serif py-1 text-left">
                {renderChildren()}
              </blockquote>
            );
          }

          return <p key={index} className="text-sm sm:text-base leading-[1.8] text-text-body font-serif text-left">{renderChildren()}</p>;
        }

        // Render dynamic image block from Sanity CDN
        const imageUrl = getSanityImageUrl(block);
        if (imageUrl) {
          const imageElement = (
            <div className="relative w-full h-64 sm:h-96 rounded-lg border border-border-primary overflow-hidden hover:opacity-95 transition-opacity">
              <Image src={imageUrl} alt={block.alt || "Editorial Illustration"} fill className="object-cover" />
            </div>
          );

          const renderClickableImage = () => {
            if (block.href) {
              const isInternal = block.href.startsWith('/') || block.href.includes('theaskt.com');
              if (isInternal) {
                return (
                  <Link href={block.href} className="cursor-pointer block">
                    {imageElement}
                  </Link>
                );
              }
              return (
                <a href={block.href} target="_blank" rel="noopener noreferrer" className="cursor-pointer block">
                  {imageElement}
                </a>
              );
            }
            return imageElement;
          };

          return (
            <figure key={index} className="my-8">
              {renderClickableImage()}
              {block.caption && <figcaption className="text-center text-xs text-text-caption mt-2.5 font-sans">{block.caption}</figcaption>}
            </figure>
          );
        }

        // Render pullQuote block
        if (block._type === 'pullQuote') {
          return (
            <blockquote key={index} className="border-l-4 border-amber-500 pl-5 italic text-lg my-6 text-text-secondary leading-relaxed font-serif py-1 text-left">
              "{block.quote}"
              {block.attribution && (
                <cite className="block text-xs font-sans text-text-muted mt-2 not-italic font-semibold">
                  — {block.attribution}
                </cite>
              )}
            </blockquote>
          );
        }

        // Render simpleTable block
        if (block._type === 'simpleTable') {
          let tableRows: string[][] = [];
          if (block.csvData) {
            tableRows = block.csvData
              .split('\n')
              .filter(Boolean)
              .map((line: string) => line.split('\t'));
          } else if (block.rows && Array.isArray(block.rows)) {
            tableRows = block.rows.map((row: any) => row.cells || []);
          }

          if (tableRows.length === 0) return null;
          const [headerRow, ...bodyRows] = tableRows;

          return (
            <div key={index} className="overflow-x-auto my-8 border border-border-primary rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-border-primary text-left border-collapse text-sm sm:text-base font-sans">
                {headerRow && (
                  <thead className="bg-bg-secondary">
                    <tr>
                      {headerRow.map((cell: string, idx: number) => (
                        <th key={idx} className="px-5 py-3 font-semibold text-text-h">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody className="divide-y divide-border-primary bg-bg-primary">
                  {bodyRows.map((row: string[], rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-bg-secondary/40 transition-colors">
                      {row.map((cell: string, cIdx: number) => (
                        <td key={cIdx} className="px-5 py-3.5 text-text-body">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

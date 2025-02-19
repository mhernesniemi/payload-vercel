import React, { Fragment } from "react";
import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  IS_CODE,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
} from "@/lib/nodeFormat";
import { SerializedTextNode } from "@payloadcms/richtext-lexical";
import type {
  SerializedElementNode,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";

type HeadingNode = SerializedElementNode & {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

type ListNode = SerializedElementNode & {
  tag: "ul" | "ol";
  listType?: string;
};

type ListItemNode = SerializedElementNode & {
  checked?: boolean;
  value?: number;
};

type NodeRendererProps = {
  node: SerializedElementNode | SerializedTextNode;
  index: number;
};

// interface LinkNode extends SerializedLexicalNode {
//   fields: {
//     newTab?: boolean;
//     doc?: unknown;
//     linkType?: "internal" | "custom";
//     url?: string;
//   };
// }

export function TextRenderer({ node, index }: NodeRendererProps) {
  if (!node) return null;

  const renderChildren = (node: SerializedElementNode) => {
    if (!node.children) return null;
    return node.children.map((child: SerializedLexicalNode, i: number) => (
      <TextRenderer key={`${index}-${i}`} node={child as SerializedElementNode} index={i} />
    ));
  };

  switch (node.type) {
    case "text": {
      const textNode = node as unknown as SerializedTextNode;
      if (!textNode.text) return null;
      const content = <Fragment key={index}>{textNode.text}</Fragment>;

      switch (textNode.format) {
        case IS_BOLD:
          return <strong key={index}>{content}</strong>;
        case IS_ITALIC:
          return <em key={index}>{content}</em>;
        case IS_STRIKETHROUGH:
          return (
            <span key={index} style={{ textDecoration: "line-through" }}>
              {content}
            </span>
          );
        case IS_UNDERLINE:
          return (
            <span key={index} style={{ textDecoration: "underline" }}>
              {content}
            </span>
          );
        case IS_CODE:
          return <code key={index}>{content}</code>;
        case IS_SUBSCRIPT:
          return <sub key={index}>{content}</sub>;
        case IS_SUPERSCRIPT:
          return <sup key={index}>{content}</sup>;
        default:
          return content;
      }
    }
    case "paragraph":
      console.log("paragraph", node);
      return (
        <p className="col-start-2" key={index}>
          {renderChildren(node)}
        </p>
      );
    case "heading": {
      const headingNode = node as HeadingNode;
      const Tag = headingNode.tag;
      return (
        <Tag className="col-start-2" key={index}>
          {renderChildren(node)}
        </Tag>
      );
    }
    case "list": {
      const listNode = node as ListNode;
      const Tag = listNode.tag;
      return (
        <Tag className="list col-start-2" key={index}>
          {renderChildren(node)}
        </Tag>
      );
    }
    case "listitem": {
      const listItemNode = node as ListItemNode;
      if (listItemNode.checked != null) {
        return (
          <li
            aria-checked={listItemNode.checked ? "true" : "false"}
            className={listItemNode.checked ? "" : ""}
            key={index}
            role="checkbox"
            tabIndex={-1}
            value={listItemNode.value}
          >
            {renderChildren(node)}
          </li>
        );
      }
      return (
        <li key={index} value={listItemNode.value}>
          {renderChildren(node)}
        </li>
      );
    }
    case "quote":
      return (
        <blockquote className="col-start-2" key={index}>
          {renderChildren(node)}
        </blockquote>
      );
    case "link": {
      // const linkNode = node as LinkNode;
      return (
        // <CMSLink
        //   key={index}
        //   newTab={Boolean(linkNode.fields?.newTab)}
        //   reference={linkNode.fields.doc}
        //   type={linkNode.fields.linkType === "internal" ? "reference" : "custom"}
        //   url={linkNode.fields.url}
        // >
        //   {renderChildren(node)}
        // </CMSLink>
        <>moi</>
      );
    }
    case "linebreak":
      return <br className="col-start-2" key={index} />;
    default:
      return null;
  }
}

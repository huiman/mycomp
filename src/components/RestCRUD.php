<?php

namespace App\Controller;

use App\Entity\Package;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/rest/CRUD")
 */
class RestCRUD extends AbstractController
{
   //const data={
   //PackageName: this.state.xxx.PackageName,
   //Time: this.state.xxx.Time,
   //Price: this.state.xxx.Price,
   //ShortName: this.state.xxx.ShortName,
   //Commission: this.state.xxx.Commission,
   //};
   //Axios.post(Routing.generate("postPackage"),data).then(res=>{console.log("postPackage Package:",res.data); this.setState({Package:res.data}); }).catch(err=>{console.log(err)});
   //Axios.get(Routing.generate("getPackage"),{params:data}).then(res=>{console.log("getPackage Package:",res.data); this.setState({Package:res.data}); }).catch(err=>{console.log(err)});

   /**
    * @Route("/",name="postCRUD", methods={"POST","HEAD"},options={"expose"=true})
    */
   public function postCRUDAction(Request $request, SerializerInterface $serializer)
   {

      //   $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');
      $em = $this->getDoctrine()->getManager();
      $res = null;
      $content = $request->getContent();
      if ($content !== '') {
         $params = json_decode($content, true);

         $entity = $params['entity'];
         $mode = $params['mode'];
         $record = isset($params['record']) ? $params['record'] : null;
         $page = isset($params['page']) ? $params['page'] : 1;
         $pageSize = isset($params['pageSize']) ? $params['pageSize'] : 100;
         $searchFields = isset($params['searchFields']) ? $params['searchFields'] : "";
         $searchKey = isset($params['searchKey']) ? $params['searchKey'] : "";
         $orderBy = isset($params['orderBy']) ? $params['orderBy'] : "";
      }

      $entity_full = "App\Entity\\$entity";
      $meta = $em->getClassMetadata($entity_full);
      $colNames = $meta->getFieldNames();
      $primaryKeyName = $meta->getSingleidentifierFieldName(); // get primary key name
      $ass_maps = $meta->getAssociationMappings();
      //init Var
      $selectFields = "";
      $col = [];
      $cols = [];
      $options = [];
      //Push Ass Mapping to Cols ++++ Plus Create Options Pass to react SELECT object
      foreach ($ass_maps as $ass_map) {
         $targetEntity = explode("\\", $ass_map["targetEntity"]);
         $targetEntity = end($targetEntity);

         $rows = [];
         if ($ass_map["type"] == 2) {
            $col = [];
            $col['fieldName'] = $ass_map["fieldName"];
            $col['type'] = "ManyToOne:" . $targetEntity;
            array_push($cols, $col);

            //Check Meta for Ass Mapping Entity
            $metaOf_assMap = $em->getClassMetadata($ass_map["targetEntity"]);
            $assMap_colNames = $metaOf_assMap->getFieldNames();
            $assMap_primaryKeyName = $meta->getSingleidentifierFieldName();
            //Query Data of Target Entity
            $qry = $em->createQueryBuilder();
            $qry = $qry->select('x')->from("App:$targetEntity", 'x');

            $data = $qry->getQuery()->getResult();

            // dump($metaOf_assMap);
            $ass_Identifier = $metaOf_assMap->getidentifier();
            // dump($metaOf_assMap->getidentifier());
            // dump($data);
            // die;

            foreach ($data as $object) { //Gererate SELECT Options
               $row = [];
               $key = ($object->{"get$ass_Identifier[0]"}());
               $text = ($object->{"__toString"}());

               $row["key"] = $key;
               $row["value"] = $key;
               $row["text"] = $text; //substr($text, 0, -1);
               array_push($rows, $row);
            }

            $options[$targetEntity] = $rows;
         } elseif ($ass_map["type"] == 4) {
            // $col['type'] = "OneToMany:" . $targetEntity;
         }
      }

      //Push Normal Columns to Cols
      foreach ($colNames as $colName) {
         $colType = $em->getClassMetadata($entity_full)->getTypeOfField($colName);
         // dump($colName);
         // dump($colType);
         $col = [];
         $col['fieldName'] = $colName;
         $col['type'] = $colType;
         array_push($cols, $col);

         //CREATE GET SQL QUERY STRING
         $selectFields .= $colName . ",";
         if ($colName !== $primaryKeyName) {
            // not Primary Key
            if ($colType == "datetime" or $colType == "date") {
               // $index_html_twig_ColumnsData .= "<td>{{ post.$colname|date('d-M-Y') }}</td>" . "\r\n";
            } elseif ($colType == "boolean") {
               // $index_html_twig_ColumnsData .= '<td>{{ post.' . $colname . '?"Yes":"No" }}</td>' . "\r\n";
            } else {
               // $index_html_twig_ColumnsData .= '<td>{{ post.' . $colname . ' }}</td>' . "\r\n";
            }
         }
      }
      //post process var
      $selectFields = substr($selectFields, 0, -1);

      if ($mode == "select") {
         $qry = $em->createQueryBuilder();
         $qry = $qry->select('x')->from("App:$entity", 'x');

         if ($orderBy) $qry = $qry->orderBy("x." . $orderBy["field"], $orderBy["by"]);

         if ($searchFields != "") {
            foreach (explode(",", $searchFields) as $searchField) {
               $qry = $qry->orWhere("x.$searchField LIKE :seachKey");
            }
            $qry = $qry->setParameter(":seachKey", "%" . $searchKey . "%");
         }

         $qry = $qry->getQuery();

         // dump($qry);
         // die;
         //->getResult();

         // load doctrine Paginator
         $data = new \Doctrine\ORM\Tools\Pagination\Paginator($qry);

         // you can get total items
         $totalItems = count($data);

         // get total pages
         $pagesCount = ceil($totalItems / $pageSize);

         // now get one page's items:
         $data
            ->getQuery()
            ->setFirstResult($pageSize * ($page - 1)) // set the offset
            ->setMaxResults($pageSize); // set the limit

         $res = [];

         //    dump($data[0]);
         $newData = [];
         foreach ($data as $object) {
            $row = [];
            foreach ($cols as $col) {
               //  dump($col['fieldName']);
               //  dump($col['type']);
               $col_fieldName = $col['fieldName'];
               $col_type = $col['type'];
               //  if ($col_fieldName != $primaryKeyName) {
               $col_data = ($object->{"get$col_fieldName"}());
               //   dump($col_fieldName);
               //   dump(empty($col_data));
               if (empty($col_data)) {
                  $modi_col_Data = null;
               } else {
                  if ($col_type == "datetime") {
                     $modi_col_Data = date_format($col_data, "d-m-Y H:i");
                  } elseif ($col_type == "date") {
                     $modi_col_Data = date_format($col_data, "d-m-Y");
                  } elseif ($col_type == "time") {
                     $modi_col_Data = date_format($col_data, "H:i");
                  } elseif (explode(":", $col_type)[0] == "ManyToOne") {
                     $modi_col_Data = $col_data->getid();
                     //  $modi_col_Data = $col_data->getid() . ":" . $col_data->__toString();
                  } elseif (explode(":", $col_type)[0] == "OneToMany") {
                     $modi_col_Data = null;
                  } else {
                     $modi_col_Data = $col_data;
                  }
               }
               $row[$col_fieldName] = $modi_col_Data;
               //  }

            }
            $newData[] = $row;
         }
         //    dump($options);die;
         $res["data"] = $newData;
         $res["fields"] = $cols;
         $res["primaryKey"] = $primaryKeyName;
         $res["options"] = $options;
         $res["pagesCount"] = $pagesCount;
      } elseif ($mode == "update") {
         $rec = $em->getRepository("App\\Entity\\$entity")->find($record[$primaryKeyName]);
         $entityInfo = $em->getClassMetadata("App\\Entity\\$entity");
         foreach (array_keys($record) as $field) {
            if ($field != $primaryKeyName) {
               $fieldType = $entityInfo->getTypeOfField($field);
               if ($record[$field] == "") {
                  $rec_data = null;
               } else {
                  if (is_null($fieldType)) {
                     $targetEntity = $ass_maps[$field]["targetEntity"];
                     $rec_data = $em->getRepository($targetEntity)->find($record[$field]);
                  } else {
                     $rec_data = $this->convertDataByType($record[$field], $fieldType);
                  }
               }
               $rec->{"set$field"}($rec_data);
            }
         }
         $em->flush();
         $res = "Success";
      } elseif ($mode == "new") {
         $entityInfo = $em->getClassMetadata("App\\Entity\\$entity");
         $rec = $entityInfo->newInstance();
         foreach (array_keys($record) as $field) {
            if ($field != $primaryKeyName) {
               $fieldType = $entityInfo->getTypeOfField($field);
               if ($record[$field] == "") {
                  $data = null;
               } else {
                  if (is_null($fieldType)) {
                     $targetEntity = $ass_maps[$field]["targetEntity"];
                     $data = $em->getRepository($targetEntity)->find($record[$field]);
                  } else {
                     $data = $this->convertDataByType($record[$field], $fieldType);
                  }
               }
               $rec->{"set$field"}($data);
            }
         }
         $em->persist($rec);
         $em->flush();
         $res = "Success:" . $rec->getId();
      } elseif ($mode == "delete") {
         $rec = $em->getRepository("App\\Entity\\$entity")->find($record[$primaryKeyName]);
         $em->remove($rec);
         $em->flush();
         $res = "Success";
      }

      // dump($qry->getDQL());
      // dump($qry->getQuery()->getSql());
      // dump($qry->getQuery()->getParameters());

      $response = new Response($serializer->serialize($res, 'json'), 200);
      $response->headers->set('Content-Type', 'application/json');
      return $response;

      dump($primaryKeyName);
      dump($ass_maps);
      dump($selectFields);
      die;

      $em->getConnection()->beginTransaction(); // suspend auto-commit
      try {
         $Package = new Package();
         $Package->setPackageName($PackageName);
         $Package->setTime($Time);
         $Package->setPrice($Price);
         $Package->setShortName($ShortName);
         $Package->setCommission($Commission);

         $em->persist($Package);
         $em->flush();
         $em->getConnection()->commit();
         $res = "Success:" . $Package->getId();
         $response = new Response(json_encode($res), 200);
         $response->headers->set('Content-Type', 'application/json');
         return $response;
      } catch (Exception $e) {
         $em->getConnection()->rollBack();
         throw $e;
         $res = "Fail";
         $response = new Response(json_encode($res), 400);
         $response->headers->set('Content-Type', 'application/json');
         return $response;
      }
   }

   private function convertDataByType($record_data, $type)
   {
      if ($type == "datetime") {
         $data = \DateTime::createFromFormat("d-m-Y H:i", $record_data);
      } elseif ($type == "date") {
         $data = \DateTime::createFromFormat("d-m-Y", $record_data);
      } elseif ($type == "time") {
         $data = \DateTime::createFromFormat("H:i", $record_data);
      } elseif ($type == "json") {
         $data = explode(",", $record_data);
      } else {
         $data = $record_data;
      }
      return $data;
   }
}
